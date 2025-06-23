import { DashBoardHeader } from "@/components/DashBoardHeader";
import { Projects } from "@/components/Projects";

export default function ProjectsPage () {
    return(
        <div className="bg-black">
            <DashBoardHeader/>
            <Projects/>
        </div>
    )
}