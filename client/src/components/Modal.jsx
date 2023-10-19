import React from "react";
import { MdVerifiedUser } from "react-icons/md";

const Modal = ({ open, onClick, close }) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center  transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <div className="text-center w-68">
          <MdVerifiedUser className="text-green-500 mx-auto w-10 h-10" />
          <div className="mx-auto my-1">
            <h3 className="text-lg font-black text-gray-800 mb-1">Confirm Amount Verification</h3>
            <p className="text-sm text-gray-500">
              Ary you sure you want to verify this challan?
            </p>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClick}
              type="button"
              className="btn bg-green-700 w-full rounded-md text-white py-1 cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={close}
              type="button"
              className="btn bg-gray-200 w-full rounded-md text-dark py-1 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
