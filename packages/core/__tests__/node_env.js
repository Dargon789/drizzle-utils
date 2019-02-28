/**
 * @jest-environment node
 */
const initTestChain = require("@drizzle-utils/test-chain");

const createDrizzleUtils = require("../index");

jest.setTimeout(20000);

describe("contract-event-stream tests in node environment", () => {
  let provider;
  let web3;
  let contractInstance;
  let artifact;
  let drizzleUtils;

  beforeAll(async () => {
    const testChain = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorageWithEvents.sol",
        contractName: "SimpleStorageWithEvents",
      },
    });

    ({ provider, web3, contractInstance } = testChain);

    artifact = {
      ...testChain.contractArtifact,
      // truffle-decoder needs this in artifact
      networks: {
        "4447": {
          address: contractInstance._address,
        },
      },
    };

    drizzleUtils = await createDrizzleUtils({ web3 });
  });

  afterAll(async () => {
    provider.close();
  });

  test("createContractEvent$ successfully returns observable", async () => {
    const event$ = await drizzleUtils.createContractEvent$({
      abi: artifact.abi,
      address: contractInstance._address,
    });

    expect(event$).toMatchSnapshot();
  });
});
