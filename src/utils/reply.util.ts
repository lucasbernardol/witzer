import assert from 'node:assert/strict';
import pkg from '../../package.json';

assert.ok(pkg?.version);

type ReplyReturns<T = any> = {
  version: string;
  data?: T;
};

type ReplyFunction = <T = any>(data?: T) => ReplyReturns<T>;

export const reply: ReplyFunction = (data) => {
  const { version } = pkg as { version: string };

  return {
    version,
    data,
  };
};
