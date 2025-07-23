import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { aclandOptions } from "../../../data/aclandOptions";
import useCrud from "../../../hooks/userCrud";

const roles = ["Acland", "DC", "DivCom"];

const AddUsers = () => {
  const [role, setRole] = useState("");
  const [district, setDistrict] = useState(null);
  const [officeName, setOfficeName] = useState("");
  const formRef = useRef(null);

  const { createItem, refetch } = useCrud("/users", "users");

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const form = e.target;

    const selectedDistrict = typeof district === "number" ? aclandOptions[district] : null;
    const selectedOffice = selectedDistrict?.offices.find(
      (office) => office.en === officeName
    );

    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      designation: form.designation.value,
      password: form.password.value,
      role,

      district:
        (role === "Acland" || role === "DC") && selectedDistrict
          ? selectedDistrict.district
          : undefined,

      acLand:
        role === "Acland" && selectedOffice
          ? {
              en: selectedOffice.en,
              bn: selectedOffice.bn,
            }
          : undefined,

      officeName:
        role === "Acland" && selectedOffice
          ? {
              en: selectedOffice.en,
              bn: selectedOffice.bn,
            }
          : role === "DC" && selectedDistrict
          ? selectedDistrict.district
          : {
              en: "Divisional Commissioner Office",
              bn: "বিভাগীয় কমিশনারের কার্যালয়",
            },
    };

    await createItem(payload);

    form.reset();
    setRole("");
    setDistrict(null);
    setOfficeName("");
  };

  return (
    <div className="w-10/12 md:w-8/12 mx-auto mt-10 shadow-xl p-10">
      <h3 className="font-bold text-lg md:text-2xl mb-4 text-center">নতুন ব্যবহারকারী</h3>

      <form ref={formRef} onSubmit={handleSubmitUser} className="space-y-4">
        <input
          name="name"
          placeholder="নাম"
          className="input input-bordered w-full bg-gray-100"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="ইমেইল"
          className="input input-bordered w-full bg-gray-100"
          required
        />
        <input
          name="phone"
          placeholder="মোবাইল"
          className="input input-bordered w-full bg-gray-100"
          required
        />
        <input
          name="designation"
          placeholder="পদবী"
          className="input input-bordered w-full bg-gray-100"
          required
        />
        <input
          name="password"
          placeholder="পাসওয়ার্ড"
          className="input input-bordered w-full bg-gray-100"
          required
        />

        <select
          name="role"
          className="select select-bordered w-full bg-gray-100"
          required
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setDistrict(null);
            setOfficeName("");
          }}
        >
          <option value="" disabled>
            রোল নির্বাচন করুন
          </option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* District and Office for Acland */}
        {role === "Acland" && (
          <>
            <select
              name="district"
              className="select select-bordered w-full bg-gray-100"
              required
              value={district ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setDistrict(value === "" ? null : Number(value));
                setOfficeName("");
              }}
            >
              <option value="" disabled>
                জেলা নির্বাচন করুন
              </option>
              {aclandOptions.map((districtObj, index) => (
                <option key={index} value={index}>
                  {districtObj.district.bn} ({districtObj.district.en})
                </option>
              ))}
            </select>

            <select
              name="officeName"
              className="select select-bordered w-full bg-gray-100"
              required
              disabled={district === null}
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
            >
              <option value="" disabled>
                অফিস নির্বাচন করুন
              </option>
              {(aclandOptions[district]?.offices || []).map((office, index) => (
                <option key={index} value={office.en}>
                  {office.bn}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Only district for DC */}
        {role === "DC" && (
          <select
            name="district"
            className="select select-bordered w-full bg-gray-100"
            required
            value={district ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setDistrict(value === "" ? null : Number(value));
              setOfficeName("");
            }}
          >
            <option value="" disabled>
              জেলা নির্বাচন করুন
            </option>
            {aclandOptions.map((districtObj, index) => (
              <option key={index} value={index}>
                {districtObj.district.bn} ({districtObj.district.en})
              </option>
            ))}
          </select>
        )}

        <div className="modal-action justify-center gap-3">
          <button type="submit" className="btn btn-primary">
            যুক্ত করুন
          </button>
          <button
            type="button"
            onClick={() => {
              formRef.current?.reset();
              setRole("");
              setDistrict(null);
              setOfficeName("");
            }}
            className="btn btn-warning"
          >
            রিসেট
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsers;
