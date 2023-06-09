import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "solid-headless";
import { BiRegularLogIn, BiRegularLogOut, BiRegularUser } from "solid-icons/bi";
import { AiOutlineProfile } from "solid-icons/ai";
import { IoSettingsOutline } from "solid-icons/io";
import { createEffect, createSignal } from "solid-js";
import { isUserDTO, type UserDTO } from "../../utils/apiTypes";
import { NotificationPopover } from "./Atoms/NotificationPopover";

const RegisterOrUserProfile = () => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;

  const [isLoadingUser, setIsLoadingUser] = createSignal(true);
  const [currentUser, setCurrentUser] = createSignal<UserDTO | null>(null);

  const logout = () => {
    void fetch(`${apiHost}/auth`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      window.location.href = "/";
    });
  };

  createEffect(() => {
    void fetch(`${apiHost}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          if (isUserDTO(data)) {
            setCurrentUser(data);
            setIsLoadingUser(false);
          }
        });
        return;
      }
      setIsLoadingUser(false);
    });
  });

  return (
    <div>
      <Transition
        show={!isLoadingUser()}
        enter="transition duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        class="flex"
      >
        <Transition
          show={!currentUser()}
          enter="transition duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <a
            class="flex space-x-2 rounded-md bg-turquoise-500 p-2 text-neutral-900"
            href="/auth/register"
          >
            Register
            <BiRegularLogIn class="h-6 w-6" />
          </a>
        </Transition>
        <NotificationPopover user={currentUser()} />
        <Transition
          show={!!currentUser()}
          enter="transition duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover defaultOpen={false} class="relative flex items-center">
            {({ isOpen }) => (
              <>
                <PopoverButton
                  aria-label="Toggle user actions menu"
                  classList={{ flex: true }}
                >
                  <BiRegularUser class="h-6 w-6 fill-current" />
                </PopoverButton>
                <Transition
                  show={isOpen()}
                  enter="transition duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <PopoverPanel
                    unmount={true}
                    class="absolute left-1/2 z-10 mt-5 -translate-x-[90%] transform px-4 sm:px-0"
                  >
                    <Menu class="flex flex-col space-y-1 overflow-hidden rounded-lg border border-slate-900 bg-neutral-100 p-1 shadow-lg drop-shadow-lg dark:bg-neutral-700 dark:text-white">
                      <MenuItem class="h-0" as="button" aria-label="Empty" />
                      <MenuItem
                        as="a"
                        class="flex space-x-2 rounded-md px-2 py-1 hover:cursor-pointer focus:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-600 dark:hover:bg-none dark:focus:bg-neutral-600"
                        href={`/user/${currentUser()?.id ?? ""}`}
                      >
                        <AiOutlineProfile class="h-6 w-6 fill-current" />
                        <div class="text-md font-medium">Profile</div>
                      </MenuItem>
                      <MenuItem
                        as="a"
                        class="flex space-x-2 rounded-md px-2 py-1 hover:cursor-pointer focus:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-600 dark:hover:bg-none dark:focus:bg-neutral-600"
                        href="/user/settings"
                      >
                        <IoSettingsOutline class="h-6 w-6 fill-current" />
                        <div class="text-md font-medium">Settings</div>
                      </MenuItem>
                      <MenuItem
                        as="button"
                        class="flex space-x-2 rounded-md px-2 py-1 hover:cursor-pointer focus:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-600 dark:hover:bg-none dark:focus:bg-neutral-600"
                        onClick={logout}
                      >
                        <BiRegularLogOut class="h-6 w-6 fill-current" />
                        <div class="text-md font-medium">Logout</div>
                      </MenuItem>
                    </Menu>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>
        </Transition>
      </Transition>
    </div>
  );
};

export default RegisterOrUserProfile;
