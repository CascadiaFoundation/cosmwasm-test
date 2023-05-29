<!-- markdownlint-disable MD033 MD034 MD036 MD041 -->

![cascadiad-tools](./public/social.png)

# cascadiad-tools

- Mainnet website: https://cascadiad.tools
- Testnet website: https://test.cascadiad.tools

## Prerequisites

**Required**

- Git
- Node.js 14 or LTS
- Yarn
- Keplr Wallet browser extension

## Local Development Setup

Follow these steps to set up the project for local development:

1. Clone the repository and navigate into the project directory:

    ```sh
    git clone https://github.com/CosmosContracts/cascadiad-tools.git
    cd cascadiad-tools
    ```

2. Install dependencies:

    ```sh
    yarn install
    ```

3. Copy the example environment file and fill in the values:

    ```sh
    cp .env.example .env
    ```

4. Start the development server:

    ```sh
    yarn dev
    ```

5. (Optional) Lint and format the project:

    ```sh
    yarn lint
    ```

## How to Use

### Link Wallet

If you want to link your own network, please modify the `config/network.ts` file. Note that some APIs have CORS issues. This can be addressed on the backend side when deploying the chain to infrastructure. As a temporary solution, we can use a CORS Allow browser extension.

### Interface with a WASM Contract

1. **Upload contract**: You can upload the contract using the "Upload" tab in the sidebar. After uploading the code, you can get transaction details. Remember the codeID for the next step.

2. **Instantiate contract**: For CW20, CW721 base contracts, you can use specific interfaces in the sidebar. For general contracts, you will need to input low-level JSON data directly. After instantiation, you can get the contract address. This address can be used to execute messages.

3. **Execute message**: You can input JSON-style messages to run transactions with the contract address.

## Integration in Other Projects

Our chain has integrated the Evmos module, causing the wallet generation algorithm to differ from the original. CosmJS doesn't directly support this yet, so we have customized the CosmWasm client of `cosmjs` to interact with our chain. You can find the detailed implementation in `signingKeplrCosmWasmClient.ts`.
