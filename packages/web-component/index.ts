class CaptureTrue extends HTMLElement {
  private liveVideo!: HTMLVideoElement;
  private recordButton!: HTMLButtonElement;
  private imagePreview!: HTMLImageElement;
  private _cameraStatus: "inactive" | "active" | "error" = "inactive";
  private captureMode: "photo" | "video" = "photo";
  private _status: "awaiting_access" | "capture" = "awaiting_access";
  private EVENT_PREFIX: string = "capture-true";
  private blob!: Blob;

  private get cameraStatus() {
    return this._cameraStatus;
  }
  private set cameraStatus(value: "inactive" | "active" | "error") {
    this._cameraStatus = value;
    this.render();
  }

  private get status() {
    return this._status;
  }
  private set status(value: "awaiting_access" | "capture") {
    this._status = value;
    this.render();
  }

  private render() {
    const isCapture =
      this._status === "capture" && this._cameraStatus === "active";

    this.recordButton?.classList.toggle("hidden", !isCapture);
    this.liveVideo?.classList.toggle("hidden", !isCapture);
    this.imagePreview?.classList.toggle("hidden", isCapture);
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        .wrapper {
          position: relative;
          width: 100%;
        }
        .recordButton {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          background-color: white;
          border-radius: 50%;
          cursor: pointer;
          border: 5px solid grey;
          z-index: 1;
        }
        .hidden {
          display: none;
        }
        video {
          width: 100%;  
        }
      </style>
      <div class="wrapper">
        <button type="button" class="recordButton hidden"></button>
        <video id="liveVideo"></video>
        <img id="imagePreview" class="hidden" />
      </div>
    `;

    this.liveVideo = this.shadowRoot!.getElementById(
      "liveVideo",
    ) as HTMLVideoElement;
    this.recordButton = this.shadowRoot!.querySelector(
      ".recordButton",
    ) as HTMLButtonElement;
    this.imagePreview = this.shadowRoot!.getElementById(
      "imagePreview",
    ) as HTMLImageElement;

    this.recordButton.addEventListener("click", () => {
      if (this.cameraStatus === "active") {
        this.capture();
      }
    });
  }

  async initiateMediaStream() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        const videoTrack = stream.getVideoTracks()[0];
        this.dispatchEvent(
          new CustomEvent(`${this.EVENT_PREFIX}:track-info`, {
            detail: {
              label: videoTrack.label,
              kind: videoTrack.kind,
              id: videoTrack.id,
              settings: videoTrack.getSettings(),
            },
          }),
        );

        this.setLiveVideoStream(stream);
        return true;
      } catch (error: any) {
        this.cameraStatus = "error";

        if (
          error.name === "NotAllowedError" ||
          error.name === "SecurityError"
        ) {
          this.dispatchEvent(
            new CustomEvent(`${this.EVENT_PREFIX}:error`, {
              detail: { error },
            })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent(`${this.EVENT_PREFIX}:error`, {
              detail: { error },
            })
          );
        }
      }
    } else {
      this.dispatchEvent(
        new CustomEvent(`${this.EVENT_PREFIX}:error`, {
          detail: { error: new Error("getUserMedia not supported") },
        })
      );
    }
  }

  capture() {
    if (this.captureMode != "photo") {
      throw new Error("Video capture not implemented yet");
    }

    const canvas = document.createElement("canvas");
    canvas.width = this.liveVideo.videoWidth;
    canvas.height = this.liveVideo.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(this.liveVideo, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.imagePreview.src = url;
          this.blob = blob;

          const event = new CustomEvent(`${this.EVENT_PREFIX}:captured`, {
            detail: { blob: this.blob },
          });
          this.dispatchEvent(event);
        }
      },
      "image/webp",
      1.0,
    );
  }

  setLiveVideoStream(stream: MediaStream) {
    this.liveVideo.srcObject = stream;
    this.liveVideo.play();
    this.status = "capture";
    this.cameraStatus = "active";
  }
}

customElements.define("capture-true", CaptureTrue);
