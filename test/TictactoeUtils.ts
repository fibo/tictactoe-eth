import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployArtifact } from "./utils";

export const LIBRARY_NAME = "TictactoeUtils";

const deployLibrary = deployArtifact(LIBRARY_NAME);

describe(LIBRARY_NAME, () => {
  async function deployFixture() {
    const library = await deployLibrary();
    return { library };
  }

  describe("indexToZ3xZ3Coordinate", async () => {
    it("works", async () => {
      const { library } = await loadFixture(deployFixture);

      expect(await library.indexToZ3xZ3Coordinate(0)).to.deep.equal([0, 0]);
      expect(await library.indexToZ3xZ3Coordinate(1)).to.deep.equal([1, 0]);
      expect(await library.indexToZ3xZ3Coordinate(2)).to.deep.equal([2, 0]);
      expect(await library.indexToZ3xZ3Coordinate(3)).to.deep.equal([0, 1]);
      expect(await library.indexToZ3xZ3Coordinate(4)).to.deep.equal([1, 1]);
      expect(await library.indexToZ3xZ3Coordinate(5)).to.deep.equal([2, 1]);
      expect(await library.indexToZ3xZ3Coordinate(6)).to.deep.equal([0, 2]);
      expect(await library.indexToZ3xZ3Coordinate(7)).to.deep.equal([1, 2]);
      expect(await library.indexToZ3xZ3Coordinate(8)).to.deep.equal([2, 2]);
    });
  });

  describe("Z3xZ3CoordinateToIndex", async () => {
    it("works", async () => {
      const { library } = await loadFixture(deployFixture);

      expect(await library.Z3xZ3CoordinateToIndex(0, 0)).to.equal(0);
      expect(await library.Z3xZ3CoordinateToIndex(1, 0)).to.equal(1);
      expect(await library.Z3xZ3CoordinateToIndex(2, 0)).to.equal(2);
      expect(await library.Z3xZ3CoordinateToIndex(0, 1)).to.equal(3);
      expect(await library.Z3xZ3CoordinateToIndex(1, 1)).to.equal(4);
      expect(await library.Z3xZ3CoordinateToIndex(2, 1)).to.equal(5);
      expect(await library.Z3xZ3CoordinateToIndex(0, 2)).to.equal(6);
      expect(await library.Z3xZ3CoordinateToIndex(1, 2)).to.equal(7);
      expect(await library.Z3xZ3CoordinateToIndex(2, 2)).to.equal(8);
    });
  });

  describe("semiSumInZ3xZ3", async () => {
    it("is the identity if both inputs are equal", async () => {
      const { library } = await loadFixture(deployFixture);

      for (let i = 0; i <= 8; i++)
        expect(await library.semiSumInZ3xZ3(i, i)).to.equal(
          i,
          `semiSumInZ3xZ3(${i}, ${i}) == ${i}`
        );
    });

    it("is simmetric", async () => {
      const { library } = await loadFixture(deployFixture);

      for (let i = 0; i <= 8; i++)
        for (let j = i; j <= 8; j++)
          expect(await library.semiSumInZ3xZ3(i, j)).to.equal(
            await library.semiSumInZ3xZ3(j, i),
            `semiSumInZ3xZ3(${i}, ${j}) == semiSumInZ3xZ3(${j}, ${i})`
          );
    });
  });
});
