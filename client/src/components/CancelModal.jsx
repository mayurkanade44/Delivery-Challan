import { useState } from "react";
import { GiCancel } from "react-icons/gi";
import Button from "./Button";
import { useCancelChallanMutation } from "../redux/challanSlice";
import { toast } from "react-toastify";
import Loading from "./Loading";

const CancelModal = ({ id, status, jobStatus }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [cancel, { isLoading }] = useCancelChallanMutation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await cancel({
        id,
        data: { note },
      }).unwrap();
      toast.success(res.msg);
      setOpen(false);
      setNote("");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div>
        {!status && jobStatus && (
          <Button
            label="Cancel"
            color="bg-red-600"
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
              <GiCancel className="text-red-600 mx-auto w-10 h-10" />
              <div className="mx-auto my-1">
                <h3 className="text-lg font-black text-gray-800 mb-1">
                  Confirm Cancellation
                </h3>
                <p className="text-left text-black">
                  Ary you sure you want to cancel this service slip?
                </p>
              </div>
              <form onSubmit={submit} className="mt-2">
                <div className="flex">
                  <label
                    htmlFor="note"
                    className="block text-md font-medium text-gray-900 mr-1"
                  >
                    Note
                    <span className="text-red-500 required-dot ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    className="w-full px-1 h-7 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="btn bg-red-700 w-full rounded-md text-white py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="btn bg-gray-200 w-full rounded-md text-dark py-1 font-semibold cursor-pointer"
                  >
                    Close
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
export default CancelModal;
