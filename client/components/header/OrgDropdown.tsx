import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Settings, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetOrganizations } from "@/hooks/project/useGetOrganizations";
import { useCreateOrganization } from "@/hooks/project/useCreateOrganization";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import ManageOrg from "./ManageOrg";

export const OrgDropdown = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  const { data: organizations = [], isLoading: orgsLoading } =
    useGetOrganizations();
  const { mutate: createOrganization, isPending: isCreatingOrg } =
    useCreateOrganization();
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const currentOrg = organizations.find((org: any) => org.id === orgId);
  const otherOrgs = organizations.filter((org: any) => org.id !== orgId);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const url = await uploadToCloudinary(file);
        setImageFile(file);
        setImageUrl(url);
      } catch (err) {
        alert("Image upload failed");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    createOrganization(
      { name: orgName, image: imageUrl },
      {
        onSuccess: () => {
          setOrgDialogOpen(false);
          setOrgName("");
          setImageFile(null);
          setImageUrl("");
        },
      }
    );
  };

  if (orgsLoading) return <div></div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-3 bg-transparent py-5 text-base text-[var(--background)] border-none hover:bg-transparent hover:text-[var(--background)] focus-visible:ring-0"
        >
          <div
            className="w-6 h-auto aspect-square bg-cover bg-center rounded-sm"
            style={
              currentOrg?.image
                ? { backgroundImage: `url(${currentOrg.image})` }
                : {}
            }
          />
          {currentOrg?.name || "Select Org"}
          <ChevronDown className="stroke-[var(--background)]/50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-[#141318] text-[var(--foreground)] border-[#2A2A2A] dark"
        align="start"
      >
        {currentOrg && (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center"
            >
              <div
                className="w-5 h-auto aspect-square bg-cover bg-center rounded-sm"
                style={
                  currentOrg?.image
                    ? { backgroundImage: `url(${currentOrg.image})` }
                    : {}
                }
              />
              <div className="flex flex-col ml-1">{currentOrg.name}</div>
              <DropdownMenuShortcut>
                <ManageOrg />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        {otherOrgs.map((org: any) => (
          <DropdownMenuItem
            key={org.id}
            className="group"
            onClick={() => router.push(`/${org.id}/projects`)}
          >
            <div
              className="w-5 h-auto aspect-square bg-cover bg-center rounded-sm"
              style={org.image ? { backgroundImage: `url(${org.image})` } : {}}
            />
            {org.name}
            <DropdownMenuShortcut>
              <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <Dialog open={orgDialogOpen} onOpenChange={setOrgDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-[var(--foreground)]/50 hover:text-[var(--foreground)] group transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#2A2A2A] flex justify-center items-center border-1 border-dashed">
                <Plus className="w-3! group-hover:stroke-[var(--foreground)] transition-all" />
              </div>
              Org үүсгэх
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="">Шинэ байгууллага үүсгэх</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOrgSubmit}>
              <div className="grid gap-4 mt-5">
                <div className="grid gap-3">
                  <Label htmlFor="org-name">Байгууллагын нэр</Label>
                  <Input
                    id="org-name"
                    name="name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3 mt-2">
                  <Label htmlFor="org-image">Image</Label>
                  <Input
                    id="org-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {isUploadingImage && (
                    <div className="text-xs text-blue-400">
                      Uploading image...
                    </div>
                  )}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Org Preview"
                      className="w-20 h-20 object-cover rounded mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="w-full gap-3 flex mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1 py-5 rounded-xl">
                    Буцах
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="flex-1 py-5 rounded-xl"
                  disabled={isCreatingOrg || isUploadingImage}
                >
                  {isCreatingOrg ? "Үүсгэж байна..." : "Үүсгэх"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
