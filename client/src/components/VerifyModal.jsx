import React, { useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import Button from "./Button";
import { useVerifyAmountMutation } from "../redux/challanSlice";
import { toast } from "react-toastify";
import Loading from "./Loading";

const VerifyModal = ({ type, amount, received, id, status }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [billAmount, setBillAmount] = useState(null);

  const [verify, { isLoading }] = useVerifyAmountMutation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await verify({ id, data: { note, billAmount } }).unwrap();
      toast.success(res.msg);
      setOpen(false);
      setNote("");
      setBillAmount(null);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  const pendingAmount = () => {
    const pendingAmount = amount - received;

    if (pendingAmount > 0) return `Forfeited amount: ${pendingAmount}`;
    else return `Excessive amount: ${Math.abs(pendingAmount)}`;
  };

  return (
    <>
      {isLoading && <Loading />}
      <div>
        {!status && (
          <Button
            label="Verify"
            color="bg-green-600"
            onClick={() => setOpen(true)}
          />
        )}
        <div
          className={`fixed inset-0 flex justify-center items-center  transition-colors ${
            open ? "visible bg-black/20" : "invisible"
          }`}
        >
          <div
            className={`bg-white rounded-xl shadow p-5 transition-all ${
              open ? "scale-100 opacity-100" : "scale-125 opacity-0"
            }`}
          >
            <div className="text-center">
              <MdVerifiedUser className="text-green-500 mx-auto w-10 h-10" />
              <div className="mx-auto my-1">
                <h3 className="text-lg font-black text-gray-800 mb-1">
                  Confirm Verification
                </h3>
                <p className="text-left text-black">
                  Ary you sure you want to verify this service slip?
                </p>
                {type !== "Bill After Job" && (
                  <p className="mt-1">
                    Total amount - {amount}
                    <br />
                    Received amount - {received}
                    <br />
                    <span className="text-red-600">{pendingAmount()}</span>
                  </p>
                )}
              </div>
              <form onSubmit={submit} className="mt-2">
                <div className="flex">
                  <label
                    htmlFor="note"
                    className="block text-md font-medium text-gray-900 mr-1"
                  >
                    {type !== "Bill After Job" ? "Note:" : "BillNo:"}
                    <span className="text-red-500 required-dot ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    className="w-full px-1 h-6 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                  />
                </div>
                {type === "Bill After Job" && (
                  <div className="flex mt-2">
                    <label
                      htmlFor="note"
                      className="block w-36 text-md font-medium text-gray-900 mr-1"
                    >
                      Bill Amount
                      <span className="text-red-500 required-dot ml-0.5">
                        *
                      </span>
                    </label>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      required
                      className="w-full px-1 h-6 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                    />
                  </div>
                )}
                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="btn bg-green-700 w-full rounded-md text-white py-1 cursor-pointer"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="btn bg-gray-200 w-full rounded-md text-dark py-1 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyModal;
