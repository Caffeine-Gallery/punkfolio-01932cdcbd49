export const idlFactory = ({ IDL }) => {
  const Distribution = IDL.Record({ 'count' : IDL.Nat, 'range' : IDL.Text });
  const Holder = IDL.Record({ 'count' : IDL.Nat, 'address' : IDL.Text });
  return IDL.Service({
    'getDistribution' : IDL.Func([], [IDL.Vec(Distribution)], ['query']),
    'getHolders' : IDL.Func([], [IDL.Vec(Holder)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
