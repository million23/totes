import { User } from "./types";
import { map } from "nanostores";
import { useLocalStorage } from "@mantine/hooks";

const __AccountData = map<User>();
const usePersistentData = () => {
	const [accountData, setAccountData] = useLocalStorage({
		key: "accountData",
		deserialize: (val) => JSON.parse(val) as User,
		serialize: (val) => JSON.stringify(val),
		getInitialValueInEffect: true,
	});

	return {
		accountData,
		setAccountData,
	};
};

export { __AccountData, usePersistentData };
