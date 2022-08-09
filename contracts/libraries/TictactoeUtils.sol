// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library TictactoeUtils {
    function indexToZ3xZ3Coordinate (uint8 index) public pure returns (uint8, uint8) {
        uint8 x = index % 3;
        uint8 y = (index -x) /3;
        return (x, y);
    }

    function Z3xZ3CoordinateToIndex (uint8 x, uint8 y) public pure returns (uint8) {
        return x + y * 3;
    }

    function semiSumInZ3xZ3 (uint8 index1, uint8 index2) public pure returns (uint8) {
        (uint8 x1, uint8 y1) = indexToZ3xZ3Coordinate(index1);
        (uint8 x2, uint8 y2) = indexToZ3xZ3Coordinate(index2);

        // Divide or multiply in Z3, it is the same.
        uint8 x3 = ((x1 + x2) * 2) % 3;
        uint8 y3 = ((y1 + y2) * 2) % 3;

        return Z3xZ3CoordinateToIndex(x3, y3);
    }

    function isWinCombination (uint8 index1, uint8 index2, uint8 index3) public pure returns (bool) {
        (uint8 x1, uint8 y1) = indexToZ3xZ3Coordinate(index1);
        (uint8 x2, uint8 y2) = indexToZ3xZ3Coordinate(index2);
        (uint8 x3, uint8 y3) = indexToZ3xZ3Coordinate(index2);

        // is vertical
        if (x1 == x2 && x2 == x3) return true;

        // is horyzontal
        if (y1 == y2 && y2 == y3) return true;

        // otherwise it can be a diagonal if semi sum matches.
        return semiSumInZ3xZ3(index1, index2) == index3;
    }
}
