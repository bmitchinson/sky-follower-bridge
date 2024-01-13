import type {
  ProfileView,
  ViewerState,
} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import van from "vanjs-core";
import { BskyUserCell, type UserCellBtnLabel } from "./components/BskyUserCell";
import { NotFoundCell } from "./components/NotFoundCell";
import { ReloadButton } from "./components/ReloadBtn";
import type { BSKY_USER_MATCH_TYPE } from "./constants";

export const getUserCells = ({
  queryParam,
  filterInsertedElement,
}: { queryParam: string; filterInsertedElement: boolean }) => {
  const userCells = document.querySelectorAll(queryParam);

  // filter out already inserted elements
  if (filterInsertedElement) {
    return Array.from(userCells).filter((userCell) => {
      const nextElement = userCell.nextElementSibling;
      if (!nextElement) {
        return true;
      }
      return (
        nextElement.classList.contains("bsky-user-content-wrapper") === false
      );
    });
  }
  return Array.from(userCells);
};

export const insertReloadEl = (clickAction: () => void) => {
  const lastInsertedEl = Array.from(
    document.querySelectorAll(".bsky-user-content"),
  ).at(-1);
  van.add(lastInsertedEl.parentElement, ReloadButton({ clickAction }));
};

export const removeReloadEl = () => {
  const reloadEl = document.querySelectorAll(".bsky-reload-btn-wrapper");
  for (const el of reloadEl) {
    el.remove();
  }
};

export const getAccountNameAndDisplayName = (userCell: Element) => {
  const [avatarEl, displayNameEl] = userCell.querySelectorAll("a");
  const twAccountName = avatarEl?.getAttribute("href")?.replace("/", "");
  const twAccountNameRemoveUnderscore = twAccountName.replaceAll("_", ""); // bsky does not allow underscores in handle, so remove them.
  const twDisplayName = displayNameEl?.textContent;
  return { twAccountName, twDisplayName, twAccountNameRemoveUnderscore };
};

export const insertBskyProfileEl = ({
  dom,
  profile,
  statusKey,
  btnLabel,
  matchType,
  addAction,
  removeAction,
}: {
  dom: Element;
  profile: ProfileView;
  statusKey: keyof ViewerState;
  btnLabel: UserCellBtnLabel;
  matchType: (typeof BSKY_USER_MATCH_TYPE)[keyof typeof BSKY_USER_MATCH_TYPE];
  addAction: () => Promise<void>;
  removeAction: () => Promise<void>;
}) => {
  van.add(
    dom.parentElement,
    BskyUserCell({
      profile,
      statusKey,
      btnLabel,
      matchType,
      addAction,
      removeAction,
    }),
  );
};

export const insertNotFoundEl = (dom: Element) => {
  van.add(dom.parentElement, NotFoundCell());
};

export const isOutOfTopViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.top < 0;
};
