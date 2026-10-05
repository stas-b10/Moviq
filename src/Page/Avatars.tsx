import {useEffect, useState,useRef} from "react";
import {useNavigate} from "react-router-dom";
import { supabase } from "../utils/supabase";
import type { Avatar } from "../utils/types/avatars";
import { FaArrowLeft, FaPlus, FaUser } from "react-icons/fa";

export default function Avatars() {
    const navigate = useNavigate(); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);
    const [customFile, setCustomFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/auth"); 
                return;
            }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
        
        if (profileError) {
            console.error("Error fetching profile:", profileError);
            setError("Unable to fetch profile data.");
            return;
        }

        setUsername(profileData.username);

        const { data: avatarsData, error: avatarsError } = await supabase
          .from('avatars')
          .select('*')
          .eq("is_default", true)
          .order('created_at', { ascending: true });

          if (avatarsError) {
            console.error("Error fetching avatars:", avatarsError);
            setError("Unable to fetch avatars.");
            return;
          }

        const formattedAvatars: Avatar[] = (avatarsData || []).map((avatar) => ({
            id: avatar.id,
            name: avatar.name,
            imageUrl: avatar.image_url,
            isDefault: avatar.is_default,
            userId: avatar.user_id,
            createdAt: avatar.created_at,
        }));

        setAvatars(formattedAvatars);
    } catch (error) {
        console.error("Error loading data:", error);
        setError("An unexpected error occurred.");
          } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setCustomAvatar(null);
    setCustomFile(null);
    setError("")
  }

  const handleCustomImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please select a JPEG, PNG, or WEBP image.");
      return;
    }

    setCustomFile(file);
    setCustomAvatar(URL.createObjectURL(file));
    setSelectedAvatar(null);
    setError("")
  }

  const handleConfirm = async () => {
    setError("");

    if (!selectedAvatar && !customFile) {
      setError("Please select or upload an avatar.");
      return;
    }

    setSaving(true);

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError("User not authenticated.");
            return;
        }

        let avatarUrl = selectedAvatar?.imageUrl || null;
        
        if (customFile) {
            const extension = customFile.name.split('.').pop()?.toLowerCase();
            const filePath = `${user.id}/avatar.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, customFile, {
                upsert: true,
                contentType: customFile.type,
            });

        if (uploadError) {
            console.error("Error uploading custom avatar:", uploadError);
            setError("Failed to upload custom avatar.");
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
            
            avatarUrl = publicUrlData.publicUrl;
        }

        if (!avatarUrl) {
            setError("Failed to determine avatar URL.");
            return;
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', user.id);

        if (updateError) {
            console.error("Error updating profile avatar:", updateError);
            setError("Failed to update avatar.");
            return;
        }

        navigate("/succesfully_registration");
    } catch (error) {
        console.error("Error during avatar selection:", error);
        setError("An unexpected error occurred.");
    } finally {
        setSaving(false);
    }};
    const handleBack = () => {
        navigate(-1);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40%">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    const previewImage = customAvatar || selectedAvatar?.imageUrl || null;

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#9747FF] from-0% via-[#3D246A] via-0% to-[#030A1B] to-40% px-5 py-8">
      <button onClick={handleBack} type="button" className="absolute left-6 top-6 flex h-11 w-11 cursor-pointer items-center justify-center text-white">
        <FaArrowLeft className="w-4 h-4" />
      </button>
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[700px] flex-col items-center">
        <h1 className="mt-10 text-center text-[40px] text-white" style={{ fontFamily: "space-grotesk-medium, sans-serif" }}>Hi {username}</h1>
        <div className="mt-4 flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full">
            {previewImage ? (
                <img src={previewImage} alt="Selected Avatar" className="h-full w-full" />
            ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-[#9747FF] from-0% via-[#010101] via-0% to-[#115994] to-40% text-white transition-transform duration-500 ease-out hover:scale-105">
                    <FaUser className="w-12 h-12" />
                </button>
            )}
        </div>
        <p className="mt-14 text-center text-white text-[18px]" style={{ fontFamily: "inter-regular, sans-serif" }}>Choose your avatar</p>
        <input type="file" ref={fileInputRef} accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleCustomImage} className="hidden" />
        <div className="mt-10 grid w-full grid-cols-3 gap-5 sm:grid-cols-5">
            {avatars.map((avatar) => {
              const isSelected = selectedAvatar?.id === avatar.id;
                return (
                    <button key={avatar.id} type="button" onClick={() => handleAvatarSelect(avatar)} className={`relative aspect-square cursor-pointer overflow-hidden rounded-full border-2 transition ${ isSelected ? "scale-[1.04] border-[#4B8DFF]" : "border-transparent hover:border-white/30" }`}>
                        <img src={avatar.imageUrl} alt={avatar.name} className="h-full w-full" />
                    </button>
                );
             })}

            <button type="button" onClick={() => fileInputRef.current?.click()} className={`relative aspect-square cursor-pointer overflow-hidden rounded-full bg-gradient-to-tr from-[#9747FF] from-0% via-[#010101] via-0% to-[#115994] to-40% text-white transition-transform duration-500 ease-out hover:scale-105 ${ customAvatar ? "ring-2 ring-white" : "" }`}>
                {customAvatar ? (
                    <img src={customAvatar} alt="Custom Avatar" className="h-full w-full" />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <FaPlus className="text-[28px]" /> 
                        <span className="text-sm" style={{ fontFamily: "noah-bold, sans-serif" }} >
                          Upload 
                        </span>
                    </div> 
                    )}
            </button>
            </div>
            {error && (
                <p className="mt-2 text-center text-red-500">{error}</p>
            )}

            <button type="button" onClick={handleConfirm} disabled={saving} className="mt-8 h-[50px] min-w-[180px] cursor-pointer rounded-[20px] bg-gradient-to-tr from-[#9747FF] from-0% via-[#010101] via-0% to-[#115994] to-40% px-8 text-white transition-transform duration-500 ease-out hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? "Saving..." : "Confirm"}
            </button>
        </div>
      </div>
  )
}
