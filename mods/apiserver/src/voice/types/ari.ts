/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  DialRecordDirection,
  MuteDirection,
  PlaybackControlAction,
  RecordFormat,
  STASIS_APP_NAME
} from "@fonoster/common";
import { Bridge } from "ari-client";

enum AriEvent {
  STASIS_START = "StasisStart",
  STASIS_END = "StasisEnd",
  CHANNEL_USER_EVENT = "ChannelUserevent",
  CHANNEL_DTMF_RECEIVED = "ChannelDtmfReceived",
  PLAYBACK_FINISHED = "PlaybackFinished",
  RECORDING_FINISHED = "RecordingFinished",
  RECORDING_FAILED = "RecordingFailed",
  WEB_SOCKET_RECONNECTING = "WebSocketReconnecting",
  WEB_SOCKET_MAX_RETRIES = "WebSocketMaxRetries",
  CHANNEL_LEFT_BRIDGE = "ChannelLeftBridge",
  DIAL = "Dial"
}

enum ChannelVar {
  INGRESS_NUMBER = "INGRESS_NUMBER",
  APP_REF = "APP_REF",
  APP_ENDPOINT = "APP_ENDPOINT",
  METADATA = "METADATA",
  CURRENT_BRIDGE = "CURRENT_BRIDGE"
}

enum FileFormat {
  SLIN16 = "slin16"
}

type Channel = {
  id: string;
  getChannelVar: (req: {
    channelId: string;
    variable: string;
  }) => Promise<{ value: string }>;
  originate: (req: {
    app: typeof STASIS_APP_NAME;
    endpoint: string;
    timeout: number;
  }) => Promise<void>;
  on: (
    event: AriEvent,
    callback: (event: Events, channel: Channel) => void
  ) => void;
  hangup: () => Promise<void>;
};

type StasisStartEvent = {
  channel: {
    id: string;
    caller: {
      name: string;
      number: string;
    };
  };
};

type PlaybackFinishedEvent = {
  playback: {
    id: string;
  };
};

type ChannelDtmfReceivedEvent = {
  digit: string;
};

type RecordingFinishedEvent = {
  recording: {
    name: string;
    duration: number;
    format: FileFormat;
    silence_duration: number;
    talking_duration: number;
  };
};

type RecordingFailedEvent = {
  recording: {
    // TODO: Enumerate possible causes
    cause: string;
  };
};

type DialStatusEvent = {
  dialstatus: string;
};

type Events = DialStatusEvent | StasisStartEvent | RecordingFinishedEvent;

// Temporary fix for ari-client types
type AriClient = {
  Channel: () => Channel;
  on: (
    event: AriEvent,
    callback: (event: Events, channel: Channel) => void
  ) => void;
  start: (appName: string) => void;
  channels?: {
    get: (req: { channelId: string }) => Promise<Channel>;
    record: (req: {
      channelId: string;
      format: RecordFormat;
      name: string;
      beep?: boolean;
      maxDurationSeconds?: number;
      maxSilenceSeconds?: number;
      terminateOn?: string;
    }) => Promise<void>;
    hangup: (req: { channelId: string }) => Promise<void>;
    answer: (req: { channelId: string }) => Promise<void>;
    play: (req: {
      channelId: string;
      media: string;
      playbackId?: string;
    }) => Promise<void>;
    sendDTMF: (req: { channelId: string; dtmf: string }) => Promise<void>;
    mute: (req: {
      channelId: string;
      direction: MuteDirection;
    }) => Promise<void>;
    unmute: (req: {
      channelId: string;
      direction: MuteDirection;
    }) => Promise<void>;
    snoopChannel: (req: {
      app: string;
      channelId: string;
      spy: DialRecordDirection.IN | DialRecordDirection.OUT;
    }) => Promise<Channel>;
  };
  bridges?: {
    get: (req: { bridgeId: string }) => Promise<Bridge>;
    create: (req: { type: "mixing" }) => Promise<Bridge>;
  };
  playbacks?: {
    control: (req: {
      playbackId: string;
      operation: PlaybackControlAction;
    }) => Promise<void>;
  };
  removeListener: (
    event: AriEvent,
    callback: (
      event: StasisStartEvent | RecordingFinishedEvent,
      channel: Channel
    ) => void
  ) => void;
};

export {
  AriEvent,
  AriClient,
  ChannelVar,
  Channel,
  FileFormat,
  StasisStartEvent,
  PlaybackFinishedEvent,
  ChannelDtmfReceivedEvent,
  RecordingFinishedEvent,
  RecordingFailedEvent
};
