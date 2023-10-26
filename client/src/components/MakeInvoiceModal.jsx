import { useState } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import Button from "./Button";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { useMakeInvoiceMutation } from "../redux/challanSlice";

const MakeInvoiceModal = ({ id, type, status, invoiceStatus }) => {
  const [open, setOpen] = useState(false);
  const [gst, setGST] = useState("");
  const [billAmount, setBillAmount] = useState(null);

  const [invoice, { isLoading }] = useMakeInvoiceMutation();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await invoice({ id, data: { gst, billAmount } }).unwrap();
      toast.success(res.msg);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <div>
        {(type === "Cash To Collect" || type === "UPI Payment") &&
          (!status || !invoiceStatus) && (
            <Button
              label="Make Invoice"
              color="bg-orange-600"
              onClick={() => setOpen(true)}
            />
          )}
        {open && (
          <div
            className={`fixed inset-0 flex justify-center items-center transition-colors ${
              open ? "visible bg-black/20" : "invisible"
            }`}
          >
            <div
              className={`bg-white rounded-xl shadow p-5 transition-all ${
                open ? "scale-100 opacity-100" : "scale-125 opacity-0"
              }`}
            >
              <div className="text-center">
                <FaFileInvoiceDollar className="text-green-500 mx-auto w-9 h-9" />
                <div className="mx-auto my-1">
                  <h3 className="text-lg font-black text-gray-800 mb-1">
                    Make A Invoice
                  </h3>
                  <p className="text-black">
                    Please provide GST Number to make a invoice.
                  </p>
                </div>
                <form onSubmit={submit} className="mt-2">
                  <div className="flex">
                    <label
                      htmlFor="note"
                      className="text-md w-40 font-medium text-gray-900 mr-1"
                    >
                      GST Number
                      <span className="text-red-500 required-dot ml-0.5">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={gst}
                      onChange={(e) => setGST(e.target.value)}
                      required
                      className="w-full px-1 h-6 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                    />
                  </div>
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
                  <div className="flex gap-4 mt-3">
                    <button
                      type="submit"
                      className="btn bg-green-700 w-full rounded-md text-white py-1 cursor-pointer"
                    >
                      Make Invoice
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
        )}
      </div>
    </>
  );
};
export default MakeInvoiceModal;
