import Nat64 "mo:base/Nat64";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Error "mo:base/Error";

actor {
    // Token configuration
    private stable let TOKEN_NAME : Text = "ICPunks Token";
    private stable let TOKEN_SYMBOL : Text = "PUNK";
    private stable let DECIMALS : Nat8 = 8;
    private stable var totalSupply : Nat = 1_000_000_000 * 10 ** Nat8.toNat(DECIMALS);

    // Balances
    private stable var balances : [(Principal, Nat)] = [];
    private var balancesMap = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    // Initialize balances
    private func initializeBalances() {
        for ((principal, balance) in balances.vals()) {
            balancesMap.put(principal, balance);
        }
    };

    system func preupgrade() {
        balances := Iter.toArray(balancesMap.entries());
    };

    system func postupgrade() {
        initializeBalances();
    };

    // ICRC-1 Types
    public type Account = {
        owner : Principal;
        subaccount : ?[Nat8];
    };

    public type TransferArgs = {
        from_subaccount : ?[Nat8];
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?[Nat8];
        created_at_time : ?Nat64;
    };

    // Token Metadata
    public query func icrc1_name() : async Text {
        TOKEN_NAME
    };

    public query func icrc1_symbol() : async Text {
        TOKEN_SYMBOL
    };

    public query func icrc1_decimals() : async Nat8 {
        DECIMALS
    };

    public query func icrc1_total_supply() : async Nat {
        totalSupply
    };

    public query func icrc1_balance_of(account : Account) : async Nat {
        let balance = balancesMap.get(account.owner);
        switch (balance) {
            case (?b) { b };
            case null { 0 };
        }
    };

    // Transfer Implementation
    public shared(msg) func icrc1_transfer(args : TransferArgs) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        
        let from_balance = switch (balancesMap.get(caller)) {
            case (?b) { b };
            case null { return #err("Insufficient balance") };
        };

        if (from_balance < args.amount) {
            return #err("Insufficient balance");
        };

        // Update balances
        balancesMap.put(caller, from_balance - args.amount);
        
        let to_balance = switch (balancesMap.get(args.to.owner)) {
            case (?b) { b };
            case null { 0 };
        };
        
        balancesMap.put(args.to.owner, to_balance + args.amount);

        #ok(args.amount)
    };

    // Existing NFT holder analytics code
    public type Holder = {
        address: Text;
        count: Nat;
    };

    public type Distribution = {
        range: Text;
        count: Nat;
    };

    private let sampleHolders : [Holder] = [
        { address = "x4cgj-kjsf8-jk3j3-kdjf8"; count = 3 },
        { address = "h7dgj-p0sf8-mn3j3-9djf8"; count = 1 },
        { address = "y1cgj-23sf8-553j3-pdjf8"; count = 5 },
        { address = "z9cgj-90sf8-773j3-qdjf8"; count = 2 },
        { address = "w2cgj-45sf8-993j3-rdjf8"; count = 1 }
    ];

    public query func getHolders() : async [Holder] {
        return sampleHolders;
    };

    public query func getDistribution() : async [Distribution] {
        let distribution = [
            { range = "1"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count == 1 }).size() },
            { range = "2-3"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count >= 2 and h.count <= 3 }).size() },
            { range = "4+"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count >= 4 }).size() }
        ];
        return distribution;
    };
}
