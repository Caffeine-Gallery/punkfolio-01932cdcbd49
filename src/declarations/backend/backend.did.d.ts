import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Distribution { 'count' : bigint, 'range' : string }
export interface Holder { 'count' : bigint, 'address' : string }
export interface _SERVICE {
  'getDistribution' : ActorMethod<[], Array<Distribution>>,
  'getHolders' : ActorMethod<[], Array<Holder>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
