import contactData from "../../json/contactData";

const table_head = [
  {
    head: "Id",
  },
  {
    head: "Name",
  },
  {
    head: "Email",
  },
  {
    head: "Phone Number",
  },
  {
    head: "Subject",
  },
  {
    head: "Message",
  },
];

const Inquiry = () => {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <h1 className="text-2xl font-semibold mb-10">Inquiry</h1>
        <table className="table-auto bg-white w-full border-collapse border border-gray-300">
          <thead className="bg-black text-white text-left">
            <tr className="text-white">
              {table_head.map((item, index) => (
                <th key={index} className="px-2 py-3 text-sm  font-semibold text-left">
                  {item.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contactData.map((user, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-2 py-3 text-[#12223D] font-normal">
                  <p className="w-12 overflow-hidden text-sm text-ellipsis whitespace-wrap  line-clamp-2">
                    {user.id}
                  </p>
                </td>
                <td className="px-2 py-3 text-[#12223D] font-normal">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap  line-clamp-2">
                    {user.name}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.email}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {user.phone}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.subject}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.message}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Inquiry;
