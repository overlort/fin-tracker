import { Bean, Cookie, Egg, Monitor, Plus } from "lucide-react";

export const Footer: React.FC = () => {
  return <div className="flex flex-col">
    <div className="flex flex-row">
      <Bean/>
      <Cookie/>
      <Plus/>
      <Egg/>
      <Monitor/>
    </div>
    <div className="h-[34px]"/>
  </div>
}