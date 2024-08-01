import { sunoUserService } from "@/lib/services";
import Section from "../../components/Section";
import { SunoUserStatus } from "@/lib/models/SunoUser";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function AdminUsers() {
  const data = await sunoUserService.getSunoUsers();

  return (
    <div className="flex flex-col w-full gap-4">
      <Section><h1 className="font-medium text-xl text-indigo-900 flex items-center">Suno Users</h1></Section>
      <div className="flex flex-col w-full justify-center items-center gap-3">
        {data.map((user) => (
          <div key={user.id} className="flex flex-col gap-2">
            <div>
              <strong>User Id: </strong> {user.id}
            </div>
            <div>
              <strong>Status: </strong>
              <select>
                <option
                  selected={user.status === SunoUserStatus.Active}
                  value={SunoUserStatus.Active}>
                  {SunoUserStatus.Active}
                </option>
                <option
                  selected={user.status === SunoUserStatus.Blocked}
                  value={SunoUserStatus.Blocked}>
                  {SunoUserStatus.Blocked}
                </option>
              </select>
            </div>
            <div>
              <strong>Cookie: </strong>
              <textarea rows={4} cols={100} value={user.cookie}></textarea>
            </div>
            <div>
              <button className="bg-sky-500 hover:bg-sky-700">
                Save changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}, { returnTo: '/' });