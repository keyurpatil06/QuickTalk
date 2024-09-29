import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";

const ContactsContainer = () => {
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        console.log(response.data.contacts);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[25vw] bg-white text-black border-r-2 w-full">
      <div className="bg-[#fbfaff] m-4 rounded-2xl flex justify-center items-center p-3">
        <span className="font-semibold text-3xl">Quick <span className="text-purple-500">Talk</span></span>
      </div>
      <div className="my-4 px-4">
        <div className="bg-[#fbfaff] flex justify-between items-center p-4 rounded-2xl my-1">
          <Title text="People" />
          <NewDM />
        </div>
        <div className="bg-[#fbfaff] flex justify-between items-center p-4 rounded-2xl my-1">
          <Title text="Groups" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ProfileInfo />
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase text-black font-semibold tracking-widest text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;