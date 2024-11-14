import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
    // Types for our data structures
    public type Holder = {
        address: Text;
        count: Nat;
    };

    public type Distribution = {
        range: Text;
        count: Nat;
    };

    // Sample data - in a real implementation, this would be fetched from the NFT contract
    private let sampleHolders : [Holder] = [
        { address = "x4cgj-kjsf8-jk3j3-kdjf8"; count = 3 },
        { address = "h7dgj-p0sf8-mn3j3-9djf8"; count = 1 },
        { address = "y1cgj-23sf8-553j3-pdjf8"; count = 5 },
        { address = "z9cgj-90sf8-773j3-qdjf8"; count = 2 },
        { address = "w2cgj-45sf8-993j3-rdjf8"; count = 1 }
    ];

    // Query function to get all holders
    public query func getHolders() : async [Holder] {
        return sampleHolders;
    };

    // Query function to get distribution data
    public query func getDistribution() : async [Distribution] {
        let distribution = [
            { range = "1"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count == 1 }).size() },
            { range = "2-3"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count >= 2 and h.count <= 3 }).size() },
            { range = "4+"; count = Array.filter<Holder>(sampleHolders, func(h) { h.count >= 4 }).size() }
        ];
        return distribution;
    };
}
