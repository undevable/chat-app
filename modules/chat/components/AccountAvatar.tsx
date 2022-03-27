import { Avatar, Paper, MantineTheme, Menu, Group } from "@mantine/core";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import {
  MdSettings,
} from "react-icons/md";
import { supabase } from "../../../utils/db/supabaseClient";
import { useRouter } from "next/router";

const AccountAvatar: NextPage = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPath, setAvatarPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getAvatarUrl = async () => {
      const userID = supabase.auth.user()!.id;
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userID)
        .single();

      if (data && !error) setAvatarUrl(data.avatar_url);
    };

    const downloadImage = async (path: string) => {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data!);
      setAvatarPath(url);
    };

    getAvatarUrl();
    if (avatarUrl) downloadImage(avatarUrl);
  }, [avatarUrl]);

  return (
    <>
      <Menu
        control={
          avatarUrl ? (
            <Avatar src={avatarPath} radius="xl" alt="Avatar" size={45} />
          ) : (
            <Paper
              sx={(theme: MantineTheme) => ({
                height: 45,
                width: 45,
                backgroundColor: theme.colors.gray[3],
                borderRadius: "100%",
              })}
              mr="xs"
            />
          )
        }
        sx={{ cursor: "pointer" }}
        trigger="hover"
        delay={200}
      >
        <Menu.Item icon={<MdSettings size={20} />} onClick={() => router.push("/account")}>Settings</Menu.Item>
      </Menu>
    </>
  );
};

export default AccountAvatar;