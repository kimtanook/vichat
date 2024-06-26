import {userInfoState} from "@/utils/atom";
import {authService} from "@/utils/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import styled from "styled-components";
import Header from "../_components/_header/Header";

export default function SubProvider({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserInfo({
          userId: user.uid,
          userName: user.displayName || "",
          userEmail: user.email || "",
          userPhotoUrl: user.photoURL || "",
          userCreateTime: user.metadata.creationTime || "",
          userSignInTime: user.metadata.lastSignInTime || "",
        });
        if (pathname === "/") {
          router.replace("/home");
        }
      } else {
        router.replace("/");
        setUserInfo(null);
      }
    });
  }, []);

  return (
    <Wrap>
      {userInfo && <Header />}
      <ChildrenBox>{children}</ChildrenBox>
    </Wrap>
  );
}
const Wrap = styled.div`
  max-width: 600px;
  margin: auto;
`;
const ChildrenBox = styled.div`
  width: 100%;
  height: calc(100vh - var(--header-height));
`;
