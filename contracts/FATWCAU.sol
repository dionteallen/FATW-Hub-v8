// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FATWCAU is ERC1155, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  uint256 public constant CAU_ID = 1;
  event CAUUsed(address indexed user, uint256 amount, bytes32 indexed perkType, bytes32 indexed referenceId);

  constructor(string memory uri_) ERC1155(uri_) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function mintCAU(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
    _mint(to, CAU_ID, amount, "");
  }

  function useCAU(uint256 amount, bytes32 perkType, bytes32 referenceId) external {
    _burn(msg.sender, CAU_ID, amount);
    emit CAUUsed(msg.sender, amount, perkType, referenceId);
  }

  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal override
  {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    if (from != address(0) && to != address(0)) revert("CAU is non-transferable");
  }
}
