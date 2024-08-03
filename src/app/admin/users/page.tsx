import AdminUsers from "../../components/admin/AdminUsers";
import { sunoUserService } from "@/lib/services";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function AdminUsersServer() {
  const sunoUsers = await sunoUserService.getSunoUsers();

  return (
    <AdminUsers initialUsers={sunoUsers} />
  );
}, { returnTo: '/' });