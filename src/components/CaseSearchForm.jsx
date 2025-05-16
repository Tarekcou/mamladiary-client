import axiosPublic from "../axios/axiosPublic";

export default function mamlaSearchForm({ handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-1 bg-white shadow-sm px-4 pt-2 pb-2">
        <div className="bg-blue-200 mb-4 py-2 font-bold text-lg text-center">
          Case Search
        </div>
        <div className="space-y-4 text-sm">
          <div className="gap-4 grid grid-cols-2">
            {/* District */}
            <label>
              District:
              <select
                name="district"
                required
                className="w-full select-bordered select"
              >
                <option value="">Select District</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Cox's Bazar">Cox's Bazar</option>
                <option value="Cumilla">Cumilla</option>
                <option value="Brahmanbaria">Brahmanbaria</option>
                <option value="Chandpur">Chandpur</option>
                <option value="Feni">Feni</option>
                <option value="Lakshmipur">Lakshmipur</option>
                <option value="Noakhali">Noakhali</option>
                <option value="Khagrachhari">Khagrachhari</option>
                <option value="Rangamati">Rangamati</option>
                <option value="Bandarban">Bandarban</option>
              </select>
            </label>

            {/* mamla Name */}
            <label>
              Case Name:
              <select
                name="mamlaName"
                required
                className="w-full select-bordered select"
              >
                <option value="">Select mamla Name</option>
                {[
                  "নামজারি মামলা",
                  "নামজারি আপিল",
                  "নামজারি রিভিশন",
                  "যৌথ নামজারি আবেদন",
                  "উত্তরাধিকার সূত্রে নামজারি",
                  "ক্রয়সূত্রে নামজারি",
                  "হুকুম দখলের ভিত্তিতে নামজারি",
                  "সার্টিফিকেট আপিল",
                  "সার্টিফিকেট রিভিশন",
                  "দাখিলকৃত খাজনা সংশোধন আবেদন",
                  "দাগ নম্বর সংশোধন",
                  "জমির পরিমাণ সংশোধন",
                  "নামের বানান সংশোধন",
                  "মৌজা বা JL নাম সংশোধন",
                  "বিবিধ সংশোধনী রিভিশন",
                  "হুকুম দখল মামলা",
                  "জমি দখল বিরোধ সংক্রান্ত মামলা",
                  "ভূমি জরিপ বিরোধ নিষ্পত্তি মামলা",
                  "রেকর্ড সংশোধন মামলা",
                  "খাসজমির পুনঃবিবেচনা মামলা",
                  "কৃষি খাস জমি সংক্রান্ত মামলা",
                  "চর জমি বন্দোবস্ত মামলা",
                  "অর্পিত সম্পত্তির মামলা",
                  "এসএ/আরএস রেকর্ড ভুল সংশোধন মামলা",
                  "ভূমি জরিপ সংক্রান্ত আপিল",
                  "মৌজা সংক্রান্ত আপিল",
                  "সীমানা বিরোধ মামলার রিভিশন",
                  "ভূমি উন্নয়ন কর হ্রাসের আবেদন",
                  "অস্থায়ী নিষেধাজ্ঞা মামলা",
                  "তথ্য অধিকার আইনে আবেদন (ভূমি সংক্রান্ত)",
                  "পুণঃশুনানির আবেদন",
                  "রুলিং ও নির্দেশনা চাওয়া মামলা",
                  "দালিলিক/রেকর্ড যাচাইয়ের আবেদন",
                  "ভূমি আপিল বোর্ডে আবেদন (চূড়ান্ত আপিল)",
                ].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            {/* mamla Type */}
            <label>
              Case Type:
              <select
                name="mamlaType"
                className="w-full select-bordered select"
              >
                <option value="">Select mamla Type</option>
                <option value="নামজারি">নামজারি</option>
                <option value="আপিল">আপিল</option>
                <option value="রিভিশন">রিভিশন</option>
                <option value="সংশোধন">সংশোধন</option>
                <option value="বিবিধ">বিবিধ</option>
              </select>
            </label>

            {/* mamla Number */}
            <label>
              Case Number:
              <input
                name="mamlaNo"
                type="text"
                className="input-bordered w-full input"
              />
            </label>

            {/* Year */}
            <label>
              Year:
              <select
                name="mamlaYear"
                required
                className="w-full select-bordered select"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = 2000 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center">
            <button type="submit" className="mx-auto mt-2 btn btn-neutral">
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
