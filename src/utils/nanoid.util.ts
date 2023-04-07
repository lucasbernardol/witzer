import { customAlphabet } from 'nanoid/async';
import { alphanumeric } from 'nanoid-dictionary';

export const LENGTH: number = 7;

export const nanoid = customAlphabet(alphanumeric, LENGTH);
