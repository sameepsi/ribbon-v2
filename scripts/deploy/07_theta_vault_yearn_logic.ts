import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  USDC_ADDRESS,
  OTOKEN_FACTORY,
  OTOKEN_FACTORY_KOVAN,
  GAMMA_CONTROLLER,
  GAMMA_CONTROLLER_KOVAN,
  MARGIN_POOL,
  MARGIN_POOL_KOVAN,
  GNOSIS_EASY_AUCTION,
  EASY_AUCTION_KOVAN,
  WETH_ADDRESS,
  YEARN_REGISTRY_ADDRESS,
} from "../../constants/constants";

const KOVAN_WETH = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";
const KOVAN_USDC = "0x7e6edA50d1c833bE936492BF42C1BF376239E9e2";

const main = async ({
  ethers,
  network,
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(`07 - Deploying Theta Vault Yearn logic on ${network.name}`);

  const isMainnet = network.name === "mainnet";
  const weth = isMainnet ? WETH_ADDRESS : KOVAN_WETH;

  const lifecycle = await deployments.get("VaultLifecycle");

  // const lifecycleYearn = await deploy("VaultLifecycleYearn", {
  //   contract: "VaultLifecycleYearn",
  //   from: deployer,
  // });

  const lifecycleYearn = await deployments.get("VaultLifecycleYearn");

  await deploy("RibbonThetaVaultYearnLogic", {
    contract: "RibbonThetaYearnVault",
    from: deployer,
    args: [
      weth,
      isMainnet ? USDC_ADDRESS : KOVAN_USDC,
      isMainnet ? OTOKEN_FACTORY : OTOKEN_FACTORY_KOVAN,
      isMainnet ? GAMMA_CONTROLLER : GAMMA_CONTROLLER_KOVAN,
      isMainnet ? MARGIN_POOL : MARGIN_POOL_KOVAN,
      isMainnet ? GNOSIS_EASY_AUCTION : EASY_AUCTION_KOVAN,
      YEARN_REGISTRY_ADDRESS,
    ],
    libraries: {
      VaultLifecycle: lifecycle.address,
      VaultLifecycleYearn: lifecycleYearn.address,
    },
    gasPrice: ethers.utils.parseUnits("150", "gwei"),
  });
};
main.tags = ["RibbonThetaVaultYearnLogic"];

export default main;