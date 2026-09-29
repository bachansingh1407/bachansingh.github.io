import Desk from "@/components/world/DeveloperDesk";
import { FrontendLab, BackendBasement, DatabaseVault } from "@/components/world/Labs";
import ProjectArcade from "@/components/world/ProjectArcade";
import DeveloperSaveFile from "@/components/world/DeveloperSaveFile";
import Beliefs from "@/components/world/Beliefs";
import SignalStation from "@/components/world/SignalStation";
import Nav from "@/components/ui/Nav";
import Terminal from "@/components/ui/Terminal";
import Toast from "@/components/ui/Toast";
import { portfolio as P } from "@/data/portfolio";
export default function Home() {
  return (<>
    <Nav /><Desk />
    <main><FrontendLab /><BackendBasement /><DatabaseVault /><ProjectArcade /><DeveloperSaveFile /><Beliefs /><SignalStation /></main>
    <footer className="foot"><p className="hand">Built by {P.name}. Drawn slightly crooked on purpose.</p></footer>
    <Terminal /><Toast />
  </>);
}
