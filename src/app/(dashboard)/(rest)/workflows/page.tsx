import { requireAuth } from "@/lib/auth-utils";

const Page=async ()=>{
    await requireAuth();
    
    return (
        <p>WorkFlows</p>
    )
}
export default Page;