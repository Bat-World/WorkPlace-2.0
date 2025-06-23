import { DashBoardHeader } from "@/components/DashBoardHeader";
import { Projects } from "@/components/Projects";
import { FunctionSquare } from "lucide-react";

export default function ProjectsPage () {
    return(
        <div className="bg-black">
            <DashBoardHeader/>
            <Projects/>
        </div>
    )
}