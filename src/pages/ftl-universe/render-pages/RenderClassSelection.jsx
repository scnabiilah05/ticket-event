import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatPrice, formatPriceFromString } from "../../../utils/PriceUtils";
import { RiVipCrownFill } from "react-icons/ri";
import { IoRocket } from "react-icons/io5";

const VIP_PRICE = import.meta.env.VITE_VIP_CLASS_PRICE;
const ALL_CLASS_ID_MO = import.meta.env.VITE_ALL_CLASS_ID_MO;
const ALL_CLASS_ID_NM = import.meta.env.VITE_ALL_CLASS_ID_NM;
const ALL_CLASS_ID_NP = import.meta.env.VITE_ALL_CLASS_ID_NP;
const BUNDLING_CLASS_ID_MO = import.meta.env.VITE_BUNDLING_CLASS_ID_MO;
const BUNDLING_CLASS_ID_NM = import.meta.env.VITE_BUNDLING_CLASS_ID_NM;
const BUNDLING_CLASS_ID_NP = import.meta.env.VITE_BUNDLING_CLASS_ID_NP;

export const RenderClassSelection = ({
  selectedPackage,
  // handleNextStep,
  handlePreviousStep,
  formDataArray,
  lengthClass,
}) => {
  // State untuk slot kelas dinamis
  const [selectedClasses, setSelectedClasses] = useState(
    Array.from({ length: lengthClass }, () => ({ id: "", is_vip: false }))
  );

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState({ getClasses: false });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info' });

  // Handler pilih kelas
  const handleClassChange = (idx, value) => {
    setSelectedClasses((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], id: value };
      // Reset Fast Track jika kelas dikosongkan
      if (!value) updated[idx].is_vip = false;
      return updated;
    });
  };

  // Handler toggle Fast Track
  const handleVipToggle = (idx) => {
    setSelectedClasses((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], is_vip: !updated[idx].is_vip };
      return updated;
    });
  };

  // getAvailableOptions menyesuaikan ke selectedClasses[idx].id
  const getAvailableOptions = (idx) => {
    let filtered = classes.filter(
      (cls) => !selectedClasses.some((sel, i) => sel.id == cls.id && i !== idx)
    );
    if (selectedPackage?.uuid === BUNDLING_CLASS_ID_MO || selectedPackage?.uuid === BUNDLING_CLASS_ID_NM || selectedPackage?.uuid === BUNDLING_CLASS_ID_NP) {
      if (idx === 1 && selectedClasses[0].id) {
        const kelasPertama = classes.find((c) => c.id == selectedClasses[0].id);
        if (kelasPertama && kelasPertama.is_bundling === 0) {
          filtered = filtered.filter((cls) => cls.is_bundling === 1);
        }
      }
    }
    return filtered;
  };

  const getClasses = async () => {
    setIsLoading({ ...isLoading, getClasses: true });

    try {
      const response = await axios.get(`/universe/class_event`);
      if (response.data.status == 'success') {
        const data = await response.data.data;
        console.log(data, 'data', selectedPackage)
        setClasses(data);
      }
    } catch (error) {
      console.error("Error fetching class:", error);
    } finally {
      setIsLoading({ ...isLoading, getClasses: false });
    }
  };

  const handleNextStep = () => {
    // console.log(selectedClasses, 'selectedClasses')
    // console.log(formDataArray, 'formDataArray')
    // console.log(selectedPackage, 'selectedPackage')
    // console.log(totalPayment, 'totalPayment')

    const data = {
      type_ticket_uuid: selectedPackage?.type_ticket_uuid,
      package_uuid: selectedPackage?.uuid,
      member: formDataArray,
      class: selectedClasses,
      total_vip: vipAddOns?.length,
      total_member: selectedPackage?.total_member,
      total_class: lengthClass,
      member_id: formDataArray.map(member => member.id_gymmaster),
      ktp_id: formDataArray.map(member => member.ktp),
      class_name: selectedClasses.map(cls => cls.classname),
    }

    console.log(data, 'data')
  }

  const handleNextStepWithValidation = () => {
    const allSelected = selectedClasses.every(cls => cls.id);
    if (!allSelected) {
      setPopup({ show: true, message: 'Silakan pilih semua kelas terlebih dahulu!', type: 'error' });
      return;
    }
    handleNextStep();
  };


  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    // Jika paket all-class, auto pilih semua kelas dan disable select
    if (selectedPackage?.uuid === ALL_CLASS_ID_MO || selectedPackage?.uuid === ALL_CLASS_ID_NM || selectedPackage?.uuid === ALL_CLASS_ID_NP) {
      setSelectedClasses(
        Array.from({ length: lengthClass }, (_, idx) => ({
          id: classes[idx]?.id || '',
          is_vip: false
        }))
      );
    }
  }, [selectedPackage, classes, lengthClass]);

  // Summary
  const chosenClasses = selectedClasses.filter(Boolean);
  const chosenPackage = `${chosenClasses.length} Classes`;
  const chosenPackagePrice = Number(selectedPackage?.price)
  const vipAddOns = selectedClasses.filter((clsObj) => clsObj.is_vip && clsObj.id);
  let totalVip = vipAddOns?.length * VIP_PRICE;
  if (selectedPackage?.is_group === 1) {
    totalVip = totalVip * Number(selectedPackage?.total_member || 1);
  }
  const totalPayment = chosenPackagePrice + totalVip;

  return (
    <div className="terms-bg">
      <div className="header-row">
        <div>
          <h2 className="title-header">Select the Classes You Want to Join</h2>
          <p className="desc-header">
            Browse the available sessions and choose the ones that best match
            your interest and availability
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="logo-header"
        />
      </div>
      <div className="divider-header"></div>
      <div className="class-selection-grid">
        {/* Kiri: Form Pilih Kelas */}
        <div className="class-selection-left">
          <div className="vip-info-box">
            <div className="vip-info-title">
              <span className="vip-badge">Fast Track Upgrade</span>
              <span className="vip-info-price">(Rp100.000 /Class)</span>
            </div>
            <ul className="vip-info-list">
              <li>Fast-track check-in</li>
              <li>Smoother class access</li>
              <li>Exclusive Fast Track badge</li>
            </ul>
          </div>
          <div className="class-selection-note">
            <span className="class-selection-note-icon">&#9432;</span>
            You can't select the same class more than once. Please choose a
            different class for each slot.
          </div>
          {/* Slot Kelas Dinamis */}
          {Array.from({ length: lengthClass }).map((_, idx) => (
            <div className="class-slot-row" key={idx}>
              <div className="class-slot-label-row">
                <label>{`Class Name ${idx + 1}`}</label>
                <div className="vip-toggle-row">
                  <span>Fast Track Upgrade</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={selectedClasses[idx].is_vip}
                      onChange={() => handleVipToggle(idx)}
                      disabled={!selectedClasses[idx].id}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <select
                className="class-slot-select"
                value={selectedClasses[idx].id}
                onChange={(e) => handleClassChange(idx, e.target.value)}
                onFocus={getClasses}
                disabled={selectedPackage?.uuid === ALL_CLASS_ID_MO || selectedPackage?.uuid === ALL_CLASS_ID_NM || selectedPackage?.uuid === ALL_CLASS_ID_NP}
              >
                <option value="">
                  { "Choose your class"}
                </option>
                
                {getAvailableOptions(idx).map((cls) => {
                  const slotTersisa = cls.max_students - cls.terdaftar;
                  return (
                    <option key={cls.id} value={cls.id} disabled={slotTersisa <= 0}>
                      {cls.classname} {slotTersisa <= 0 ? "(Full)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        {/* Kanan: Summary */}
        <div className="class-selection-right">
          <div className="summary-box">
            <div className="summary-title">Summary</div>
            <div className="summary-desc">
              Make sure your chosen classes and package are correct before
              proceeding.
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Class</div>
              <div className="summary-chosen-class-list">
                {selectedClasses.map((clsObj, idx) => {
                  const found = classes.find((c) => c.id == clsObj.id);
                  return found ? (
                    <div className="summary-chosen-class-item" key={idx}>
                      {found.classname}
                      {clsObj.is_vip && (
                        <span className="vip-badge small"> <IoRocket />Fast Track</span>
                        // <RiVipCrownFill className="vip-badge small" />
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Package</div>
              <div className="summary-chosen-package-row">
                <span>{chosenPackage}</span>
                <span className="summary-chosen-package-price">
                  Rp{chosenPackagePrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Detail Add Ons</div>
              <div className="summary-addons-list">
                {vipAddOns?.length === 0 && (
                  <div className="summary-addons-empty">-</div>
                )}
                {vipAddOns?.map((clsObj, idx) => {
                  const found = classes.find((c) => c.id == clsObj.id);
                  return found ? (
                    <div className="summary-addons-item" key={clsObj.id}>
                      <span>
                        {found.classname} <span className="vip-badge small">Fast Track</span>
                      </span>
                      <span>
                        Rp{selectedPackage?.is_group === 1
                          ? `${formatPrice(VIP_PRICE)} x ${selectedPackage?.total_member} member`
                          : formatPrice(VIP_PRICE)}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="summary-total-row">
              <span>Total Payment</span>
              <span className="summary-total-amount">
                Rp{totalPayment.toLocaleString()}
              </span>
            </div>
            <div className="summary-btn-row">
              {/* <button className="summary-prev-btn" onClick={handlePreviousStep}>
                Previous
              </button> */}
              <button className="summary-next-btn" onClick={handleNextStepWithValidation}>
                Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom right button row */}
      <div className="terms-btn-row">
        <button
          className="terms-btn terms-btn-prev"
          onClick={handlePreviousStep}
        >
          Back
        </button>
      </div>
      {popup.show && (
        <div className="popup-overlay" onClick={() => setPopup({ show: false, message: '', type: 'info' })}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div className={`popup-icon ${popup.type}`}>
              {popup.type === 'error' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="popup-message">{popup.message}</div>
            <button className="popup-button" onClick={() => setPopup({ show: false, message: '', type: 'info' })}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
