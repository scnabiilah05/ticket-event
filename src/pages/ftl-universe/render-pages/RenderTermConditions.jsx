import React, { useState } from "react";
import "../pages/RegistrationPages.css";

export const RenderTermConditions = ({ handleNextStep, handlePreviousStep }) => {
  const termsList = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet gravida purus. Vivamus tristique, justo sed fringilla tincidunt, urna ligula finibus lectus, vitae rhoncus erat turpis ac mauris.",
    "Integer nec nisi in ligula gravida euismod. Nulla non convallis justo. Curabitur tincidunt, metus non volutpat euismod, augue neque egestas libero, non bibendum leo augue in mauris.",
    "Quisque volutpat, arcu et efficitur porttitor, augue nisi lobortis ex, a bibendum nulla magna et turpis. Suspendisse potenti. Duis vehicula velit ac sapien tincidunt, in pretium sem tincidunt.",
    "Morbi dignissim, eros non ultricies lacinia, justo metus pulvinar risus, nec condimentum felis justo nec mauris. Etiam eget arcu nec purus facilisis imperdiet in ac nunc.",
    "Donec eu malesuada ante, at gravida purus. Aenean eu urna et lorem pulvinar imperdiet. Vestibulum vel congue lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  ];

  const [agree, setAgree] = useState(false);

  return (
    <div className="terms-bg">
      <div className="header-row">
        <div>
          <h2 className="title-header">Terms & Conditions</h2>
          <p className="desc-header">
            Please read carefully before completing your ticket purchase
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="logo-header"
        />
      </div>
      <div className="divider-header"></div>
      <div className="terms-card">
        {termsList?.map((term, idx) => (
          <div className="terms-item" key={idx}>
            <div className="terms-number">{idx + 1}</div>
            <div className="terms-text">{term}</div>
          </div>
        ))}
      </div>
      <div className="terms-actions-row">
        <label className="terms-checkbox-label">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span className="terms-checkbox-custom"></span>I Agree to the terms
          and conditions
        </label>
      </div>
      <div className="terms-btn-row">
        <button
          className="terms-btn terms-btn-prev"
          onClick={handlePreviousStep}
        >
          Previous
        </button>
        <button
          className="terms-btn terms-btn-next"
          disabled={!agree}
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );
};
