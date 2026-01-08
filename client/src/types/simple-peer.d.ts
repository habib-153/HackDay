declare module "simple-peer" {
  export interface SignalData {
    type?: "offer" | "answer" | "pranswer" | "rollback";
    sdp?: string;
    candidate?: RTCIceCandidateInit;
    renegotiate?: boolean;
    transceiverRequest?: {
      kind: "audio" | "video";
      init?: RTCRtpTransceiverInit;
    };
  }

  export interface Options {
    initiator?: boolean;
    channelConfig?: RTCDataChannelInit;
    channelName?: string;
    config?: RTCConfiguration;
    offerOptions?: RTCOfferOptions;
    answerOptions?: RTCAnswerOptions;
    sdpTransform?: (sdp: string) => string;
    stream?: MediaStream;
    streams?: MediaStream[];
    trickle?: boolean;
    allowHalfTrickle?: boolean;
    wrtc?: {
      RTCPeerConnection: typeof RTCPeerConnection;
      RTCSessionDescription: typeof RTCSessionDescription;
      RTCIceCandidate: typeof RTCIceCandidate;
    };
    objectMode?: boolean;
  }

  export interface Instance extends NodeJS.EventEmitter {
    signal(data: SignalData): void;
    send(data: string | Uint8Array | ArrayBuffer | Blob): void;
    addStream(stream: MediaStream): void;
    removeStream(stream: MediaStream): void;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
    replaceTrack(
      oldTrack: MediaStreamTrack,
      newTrack: MediaStreamTrack,
      stream: MediaStream
    ): void;
    addTransceiver(kind: "audio" | "video", init?: RTCRtpTransceiverInit): void;
    destroy(err?: Error): void;
    readonly connected: boolean;
    readonly destroyed: boolean;
    readonly initiator: boolean;
    readonly channelName: string;
    address(): { port: number; family: string; address: string };
    _pc: RTCPeerConnection;
    _channel: RTCDataChannel;

    on(event: "signal", listener: (data: SignalData) => void): this;
    on(event: "connect", listener: () => void): this;
    on(event: "data", listener: (data: Uint8Array) => void): this;
    on(event: "stream", listener: (stream: MediaStream) => void): this;
    on(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "iceStateChange", listener: (iceConnectionState: RTCIceConnectionState, iceGatheringState: RTCIceGatheringState) => void): this;
    on(event: "negotiated", listener: () => void): this;
  }

  const Peer: {
    new (opts?: Options): Instance;
    WEBRTC_SUPPORT: boolean;
  };

  export default Peer;
  export { Instance, SignalData, Options };
}

