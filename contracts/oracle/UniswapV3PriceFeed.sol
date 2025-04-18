// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.24;

import {Address} from "./utils/Address.sol";
import {IUniswapV3Pool} from "./interfaces/IUniswapV3Pool.sol";
import {FixedPoint96} from "./libraries/FixedPoint96.sol";
import {FullMath} from "./libraries/FullMath.sol";
import {TickMath} from "./libraries/TickMath.sol";
import {IUniswapV3PriceFeed} from "./interface/IUniswapV3PriceFeed.sol";
import {BlockContext} from "./base/BlockContext.sol";

contract UniswapV3PriceFeed is IUniswapV3PriceFeed, BlockContext {
    using Address for address;

    //
    // STATE
    //

    uint32 internal _TWAP_INTERVAL = 30 * 60;

    address public immutable pool;

    //
    // EXTERNAL
    //

    constructor(address poolArg) {
        // UPF_PANC: pool address is not contract
        require(address(poolArg).isContract(), "UPF_PANC");

        pool = poolArg;
    }

    function getPrice() external view override returns (uint256) {
        uint256 markTwapX96 = _formatSqrtPriceX96ToPriceX96(
            _getSqrtMarkTwapX96(_TWAP_INTERVAL)
        );
        return _formatX96ToX10_18(markTwapX96);
    }

    function decimals() external pure override returns (uint8) {
        return 18;
    }

    function updateTwapInterval(uint32 twapInterval) external {
        // UPF_TWI: twapInterval is too short
        require(twapInterval >= 10, "UPF_TWI");

        _TWAP_INTERVAL = twapInterval;
    }

    //
    // INTERNAL
    //

    /// @dev if twapInterval < 10 (should be less than 1 block), return market price without twap directly
    ///      as twapInterval is too short and makes getting twap over such a short period meaningless
    function _getSqrtMarkTwapX96(
        uint32 twapInterval
    ) internal view returns (uint160) {
        if (twapInterval < 10) {
            (uint160 sqrtMarketPrice, , , , , , ) = IUniswapV3Pool(pool)
                .slot0();
            return sqrtMarketPrice;
        }
        uint32[] memory secondsAgos = new uint32[](2);

        // solhint-disable-next-line not-rely-on-time
        secondsAgos[0] = twapInterval;
        secondsAgos[1] = 0;
        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(pool).observe(
            secondsAgos
        );

        // tick(imprecise as it's an integer) to price
        int56 tickDelta = tickCumulatives[1] - tickCumulatives[0];
        int56 intervalsElapsed = int56(int32(twapInterval)); // safe conversion: uint32 -> int32 -> int56
        return TickMath.getSqrtRatioAtTick(int24(tickDelta / intervalsElapsed));
    }

    function _formatSqrtPriceX96ToPriceX96(
        uint160 sqrtPriceX96
    ) internal pure returns (uint256) {
        return FullMath.mulDiv(sqrtPriceX96, sqrtPriceX96, FixedPoint96.Q96);
    }

    function _formatX96ToX10_18(
        uint256 valueX96
    ) internal pure returns (uint256) {
        return FullMath.mulDiv(valueX96, 1e18, FixedPoint96.Q96);
    }
}
