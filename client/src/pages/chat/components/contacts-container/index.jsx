import logo from "@/assets/react.svg"
import ProfileInfo from "./components/profile-info"

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] bg-[#1b1c24] border-2 border-[#2f303b] w-full">
      <div className="pt-3 flex items-center gap-2">
        <img src={logo} alt="QuickTalk" className="m-2 mr-0" />
        <span className="text-xl font-semibold ">QuickTalk</span>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="Direct Messages" />
        </div>
        <div className="flex justify-between items-center pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  )
}

export default ContactsContainer;