
const topics= [
	{
		id: "28AEAE85-9DDA-45B6-981B-1CFCDCC61E14",
		name: "African American Heritage"
	},
	{
		id: "F3883A66-A7CB-461B-868E-1B5932224B25",
		name: "American Revolution"
	},
	{
		id: "FB3641FE-67A3-4EC7-B9C4-0A0867776798",
		name: "Ancient Seas"
	},
	{
		id: "0D00073E-18C3-46E5-8727-2F87B112DDC6",
		name: "Animals"
	},
	{
		id: "7F81A0CB-B91F-4896-B9A5-41BE9A54A27B",
		name: "Archeology"
	},
	{
		id: "69693007-2DF2-4EDE-BB3B-A25EBA72BDF5",
		name: "Architecture and Building"
	},
	{
		id: "77B7EFDF-1A74-409C-8BA2-324EC919DB0E",
		name: "Arctic"
	},
	{
		id: "00F3C3F9-2D67-4802-81AE-CCEA5D3BA370",
		name: "Arts"
	},
	{
		id: "227D2677-28CA-4CBF-997F-61108975A497",
		name: "Asian American Heritage"
	},
	{
		id: "B912363F-771C-4098-BA3A-938DF38A9D7E",
		name: "Aviation"
	},
	{
		id: "FC27FD15-62AA-4662-A97F-8E2A1A7CDE35",
		name: "Banking"
	},
	{
		id: "D10852A3-443C-4743-A5FA-6DD6D2A054B3",
		name: "Birthplace"
	},
	{
		id: "607D41B0-F830-4C07-A557-BCEF880A3929",
		name: "Burial, Cemetery and Gravesite"
	},
	{
		id: "BCE3ACBE-7871-495B-AEA3-5E19BC482405",
		name: "Canyons and Canyonlands"
	},
	{
		id: "E25F3456-43ED-45DD-93BC-057F9B944F7A",
		name: "Caves, Caverns and Karst"
	},
	{
		id: "4DC11D06-00F1-4A01-81D0-89CCCCE4FF50",
		name: "Climate Change"
	},
	{
		id: "46FC5CBD-9AD5-48F1-B4DA-1357031B1D2E",
		name: "Coasts, Islands and Atolls"
	},
	{
		id: "7F12224B-217A-4B07-A4A2-636B1CE7F221",
		name: "Colonization and Settlement"
	},
	{
		id: "1170EEB6-5070-4760-8E7D-FF1A98272FAD",
		name: "Commerce"
	},
	{
		id: "DAAD7F5E-9112-45F2-9A27-DA51B639F27E",
		name: "Dams"
	},
	{
		id: "CDD8F34E-3BD4-425A-8264-4F0BA0DFBA38",
		name: "Dunes"
	},
	{
		id: "FE005582-12C5-472C-8229-3CB004DB050E",
		name: "Engineering"
	},
	{
		id: "D9FC6D14-F8C7-4EBA-86EA-DFD99B6BB4F5",
		name: "Enslavement"
	},
	{
		id: "F79C1242-80FF-40F0-A0C1-5FFCBA172EC0",
		name: "Estuaries and Mangroves"
	},
	{
		id: "12EA2B56-17EC-410A-A10D-BFBA87A0669B",
		name: "Explorers and Expeditions"
	},
	{
		id: "1F833C99-A75D-4F9E-9256-B96523485466",
		name: "Farming and Agriculture"
	},
	{
		id: "04A39AB8-DD02-432F-AE5F-BA1267D41A0D",
		name: "Fire"
	},
	{
		id: "9F6A7003-59D6-4438-935F-760FD04C1073",
		name: "Foothills, Plains and Valleys"
	},
	{
		id: "41B1A0A3-11FF-4F55-9CB9-034A7E28B087",
		name: "Forests and Woodlands"
	},
	{
		id: "988B4AFC-F478-4673-B66D-E6BDB0CCFF35",
		name: "Forts"
	},
	{
		id: "F6D3A52E-608F-47D6-96DF-1FD64122A2FC",
		name: "Fossils and Paleontology"
	},
	{
		id: "F0F97E32-2F29-41B4-AF98-9FBE8DAB36B1",
		name: "Geology"
	},
	{
		id: "F16A7A2C-174D-4FD8-9203-8D8D8EAD644B",
		name: "Geothermal"
	},
	{
		id: "FBB14C45-1663-4714-9D28-B2B99874644D",
		name: "Glaciers"
	},
	{
		id: "94262026-92F5-48E9-90EF-01CEAEFBA4FF",
		name: "Grasslands"
	},
	{
		id: "F12B6BDB-2FE9-4961-9DC2-59FEBC0990CD",
		name: "Great Depression"
	},
	{
		id: "4BE01DC5-52E6-4F18-8C9A-B22D65965F6D",
		name: "Groundwater"
	},
	{
		id: "78078CA8-DCBC-4320-A7BF-259A56D55CA2",
		name: "Hispanic American Heritage"
	},
	{
		id: "2B428F59-9148-40C1-B38E-130589F2540E",
		name: "Immigration"
	},
	{
		id: "66151063-AD2D-43C4-A385-5876B5AAD4F3",
		name: "Impact Craters"
	},
	{
		id: "351EE154-87AA-46B0-BBA1-ED604368ACE9",
		name: "Incarceration"
	},
	{
		id: "0B575E33-B68F-4F3D-998E-B03284606CF3",
		name: "Industry"
	},
	{
		id: "E0AB480F-3A94-4DC1-8B21-9555F2C59B32",
		name: "LGBTQ American Heritage"
	},
	{
		id: "14FA9FF3-7D86-4406-9A6D-BE9032A1C578",
		name: "Laborer and Worker"
	},
	{
		id: "1CF1F6BB-A037-445B-8CF2-81428E50CE52",
		name: "Lakes"
	},
	{
		id: "AF4F1CDF-E6C4-4886-BA91-8BC887DC2793",
		name: "Landscape Design"
	},
	{
		id: "9FCC01C6-F068-4A05-9A78-23FEBFADAF56",
		name: "Latino American Heritage"
	},
	{
		id: "4C9D4777-A9DA-47D1-A0B9-F4A3C98BC1B3",
		name: "Maritime"
	},
	{
		id: "4B3CD083-7500-434B-A8C2-D355925E0245",
		name: "Medicine"
	},
	{
		id: "69E16062-0E4F-4DE0-91FB-E4EDB2484572",
		name: "Migrations"
	}
];

module.exports = topics;
