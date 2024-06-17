import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import coinImage from "../../../../assets/coin.png";
import "./ProfileModal.scss";

const ProfileModal = ({ isOpen, onClose, user }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsFlipped(true);
			setTimeout(() => setIsFlipped(false), 1000);
		}
	}, [isOpen]);

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box className={`modalContainer ${isFlipped ? "flip" : ""}`}>
				<Box className="closeButton" onClick={onClose}>
					<CloseIcon />
				</Box>
				<Box className="profileIcon">
					<AccountCircleIcon
						style={{ height: "7rem", width: "7rem", cursor: "pointer" }}
					/>
				</Box>
				<div className="userDetailsContainer">
					<div className="userEmail">{user.email}</div>
					<div className="walletBalance">
						<img
							src={coinImage}
							alt="coin-lang"
							className={`coinImage ${isFlipped ? "flipped" : ""}`}
						/>
						&nbsp;
						{user.walletBalance}
					</div>
				</div>
			</Box>
		</Modal>
	);
};

export default ProfileModal;
