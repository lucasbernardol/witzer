import { alphanumeric } from 'nanoid-dictionary';
import { customAlphabet } from 'nanoid/async';

export const NANOID_DEFAULT_SIZE = 8;

export const nanoid = customAlphabet(alphanumeric, NANOID_DEFAULT_SIZE);
