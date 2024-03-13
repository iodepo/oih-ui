import React, { useState } from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Popover from "@mui/material/Popover";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Papa from "papaparse";
import LoadingButton from "@mui/lab/LoadingButton";
import { dataServiceUrl } from "../../config/environment";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Svg,
  Rect,
  G,
  Path,
  Defs,
  ClipPath,
  Font,
} from "@react-pdf/renderer";
import { createObjectExport } from "portability/typesMap";

const Export = (props) => {
  const { palette, uri, searchType, resultCount } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState("10");
  const [typeOfExport, setTypeOfExport] = useState("pdf");

  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickExport = (value, format) => {
    handleClose();
    setIsLoading(true);
    let URI = uri;
    if (URI !== "" && resultCount !== 0) {
      if (value === "all") {
        const requests = [];
        const CHUNK_SIZE = 1000;
        for (let i = 0; i < resultCount; i += CHUNK_SIZE) {
          const chunkValue = Math.min(CHUNK_SIZE, resultCount - i);
          const chunkURI = URI.replace(
            /rows=\d+/,
            `rows=${chunkValue}&start=${i}`
          );
          requests.push(fetch(chunkURI).then((response) => response.json()));
        }

        Promise.all(requests)
          .then((responses) => {
            const allDocs = responses.reduce((acc, response) => {
              return acc.concat(response.docs);
            }, []);

            const newJson = createObjectExport(allDocs, searchType);

            download(format, newJson, searchType);
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
      } else {
        URI = URI.replace(/rows=\d+/, "rows=" + value);
        fetch(URI)
          .then((response) => response.json())
          .then((json) => {
            const docs = json.docs;

            const newJson = createObjectExport(docs, searchType);

            download(format, newJson, searchType);
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
      }
    }
  };

  const download = async (format, data, searchType) => {
    let blob, url, a;
    switch (format) {
      case "jsonLD":
        const fetchPromises = data.data.map((d) => {
          const jsonLdParams = new URLSearchParams({ id: d["id"] }).toString();
          return fetch(`${dataServiceUrl}/source?${jsonLdParams}`).then(
            (response) => response.json()
          );
        });

        const result = await Promise.all(fetchPromises);
        const json = JSON.stringify(result, null, 2);
        blob = new Blob([json], { type: "application/json" });
        url = window.URL.createObjectURL(blob);
        a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        a.click();
        window.URL.revokeObjectURL(url);
        break;

      case "csv":
        var csv = Papa.unparse(data.data);
        blob = new Blob([csv], { type: "text/csv" });
        url = window.URL.createObjectURL(blob);
        a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        a.click();
        window.URL.revokeObjectURL(url);
        break;
      case "pdf":
        const doc = createPDF(data.data, data.title);
        blob = await pdf(doc).toBlob();
        url = window.URL.createObjectURL(blob);
        a = document.createElement("a");
        a.href = url;
        a.download = "data.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
        break;
      default:
        break;
    }
    setIsLoading(false);
  };

  const styles = StyleSheet.create({
    page: {
      //backgroundColor: "#d7f8fa",
    },
    section: {
      padding: 10,
      fontFamily: "Courier",
      fontSize: 12,
    },
    title: {
      fontSize: 24,
      padding: 10,
      textAlign: "left",
      fontFamily: "Montserrat",
    },
    svg: {
      marginVertical: 15,
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#d7f8fa",
      width: "100%",
    },
    boldCategory: {
      fontFamily: "Montserrat-Bold",
    },
    boldTitle: {
      fontFamily: "Montserrat-Bold",
      marginBottom: 5,
      color: "#2B498C",
      fontSize: 14,
    },
  });

  const SvgOceanLogo = () => (
    <Svg
      style={styles.svg}
      width="136"
      height="31"
      viewBox="0 0 136 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_51_1474)">
        <Path
          d="M15.8165 0.142853C7.1602 0.142853 0.142822 6.95825 0.142822 15.3654C0.142822 23.7726 7.1602 30.588 15.8165 30.588C24.4729 30.588 31.4902 23.7726 31.4902 15.3654C31.4902 6.95825 24.4742 0.142853 15.8165 0.142853ZM9.42797 6.05126C11.3238 4.8649 13.6344 4.22429 15.8165 4.22429C21.8786 4.22429 26.8423 8.79041 27.2611 14.5741C26.2737 11.6803 23.6848 9.49469 20.5126 9.00871C20.0765 8.94114 19.6296 8.90606 19.1734 8.90606C17.5224 8.90606 15.9811 9.36215 14.6753 10.1535C16.7357 11.0098 18.178 12.9966 18.178 15.3095C18.178 18.2098 15.8152 20.6306 12.8504 20.8827C9.85075 21.1374 7.32878 19.213 6.11127 16.6609C4.77336 13.8568 5.02488 10.6811 6.97958 8.20958C7.64854 7.36366 8.48741 6.63989 9.42663 6.05126H9.42797Z"
          fill="#2B498C"
        />
        <Path
          d="M12.33 21.1634C10.3512 21.1634 8.45134 20.2473 7.05054 18.5971L7.46262 18.267C8.87813 19.9342 10.8342 20.7931 12.8277 20.6229C15.6774 20.3799 17.9104 18.0461 17.9104 15.3083C17.9104 13.1643 16.5993 11.2333 14.5696 10.39L14.0987 10.1938L14.5335 9.93003C15.9223 9.08801 17.5264 8.64362 19.1721 8.64362C19.6377 8.64362 20.1019 8.6787 20.5541 8.75017C23.8093 9.24914 26.4758 11.4477 27.514 14.4897L27.0069 14.6534C26.0329 11.7973 23.5283 9.73122 20.4712 9.26343C20.0471 9.19716 19.6096 9.16338 19.1734 9.16338C17.794 9.16338 16.4467 9.49603 15.2453 10.1288C17.2053 11.1424 18.4456 13.124 18.4456 15.3083C18.4456 18.3125 15.9985 20.8736 12.8745 21.14C12.6925 21.1556 12.5106 21.1634 12.33 21.1634Z"
          fill="#40AAD3"
        />
        <Path
          d="M13.3521 21.4571C13.9706 21.4571 14.472 20.9702 14.472 20.3695C14.472 19.7688 13.9706 19.2819 13.3521 19.2819C12.7337 19.2819 12.2323 19.7688 12.2323 20.3695C12.2323 20.9702 12.7337 21.4571 13.3521 21.4571Z"
          fill="#40AAD3"
        />
        <Path
          d="M7.34884 19.4949C7.96731 19.4949 8.46868 19.008 8.46868 18.4073C8.46868 17.8066 7.96731 17.3197 7.34884 17.3197C6.73037 17.3197 6.229 17.8066 6.229 18.4073C6.229 19.008 6.73037 19.4949 7.34884 19.4949Z"
          fill="#40AAD3"
        />
        <Path
          d="M18.0562 16.1827C18.6747 16.1827 19.1761 15.6958 19.1761 15.0951C19.1761 14.4945 18.6747 14.0075 18.0562 14.0075C17.4378 14.0075 16.9364 14.4945 16.9364 15.0951C16.9364 15.6958 17.4378 16.1827 18.0562 16.1827Z"
          fill="#40AAD3"
        />
        <Path
          d="M14.4719 11.1008C15.0904 11.1008 15.5917 10.6138 15.5917 10.0132C15.5917 9.41251 15.0904 8.92557 14.4719 8.92557C13.8534 8.92557 13.3521 9.41251 13.3521 10.0132C13.3521 10.6138 13.8534 11.1008 14.4719 11.1008Z"
          fill="#40AAD3"
        />
        <Path
          d="M21.0465 10.1444C21.6649 10.1444 22.1663 9.65742 22.1663 9.05675C22.1663 8.45608 21.6649 7.96915 21.0465 7.96915C20.428 7.96915 19.9266 8.45608 19.9266 9.05675C19.9266 9.65742 20.428 10.1444 21.0465 10.1444Z"
          fill="#40AAD3"
        />
        <Path
          d="M27.2839 15.3654C27.9024 15.3654 28.4037 14.8785 28.4037 14.2778C28.4037 13.6771 27.9024 13.1902 27.2839 13.1902C26.6654 13.1902 26.1641 13.6771 26.1641 14.2778C26.1641 14.8785 26.6654 15.3654 27.2839 15.3654Z"
          fill="#40AAD3"
        />
        <Path
          d="M41.7347 0.757477H37.2581V29.9214H41.7347V0.757477Z"
          fill="#2B498C"
        />
        <Path
          d="M66.3805 0.757477V12.1039H53.404V0.757477H48.9274V29.9214H53.404V16.4517H66.3805V29.9214H70.8572V0.757477H66.3805Z"
          fill="#2B498C"
        />
      </G>
      <Path
        d="M83.8114 15.7975C83.8114 16.2718 83.7543 16.7032 83.64 17.0918C83.5257 17.4746 83.3571 17.8061 83.1343 18.0861C82.9114 18.3661 82.6343 18.5803 82.3029 18.7289C81.9714 18.8775 81.5886 18.9518 81.1543 18.9518C80.7029 18.9518 80.3086 18.8775 79.9714 18.7289C79.64 18.5746 79.3629 18.3603 79.14 18.0861C78.9229 17.8061 78.76 17.4718 78.6514 17.0832C78.5429 16.6946 78.4886 16.2632 78.4886 15.7889C78.4886 15.1603 78.5857 14.6118 78.78 14.1432C78.9743 13.6746 79.2686 13.3089 79.6629 13.0461C80.0629 12.7832 80.5629 12.6518 81.1629 12.6518C81.74 12.6518 82.2257 12.7832 82.62 13.0461C83.0143 13.3032 83.3114 13.6689 83.5114 14.1432C83.7114 14.6118 83.8114 15.1632 83.8114 15.7975ZM79.2943 15.7975C79.2943 16.3118 79.36 16.7546 79.4914 17.1261C79.6229 17.4975 79.8257 17.7832 80.1 17.9832C80.38 18.1832 80.7314 18.2832 81.1543 18.2832C81.5829 18.2832 81.9343 18.1832 82.2086 17.9832C82.4829 17.7832 82.6829 17.4975 82.8086 17.1261C82.94 16.7546 83.0057 16.3118 83.0057 15.7975C83.0057 15.0261 82.8571 14.4232 82.56 13.9889C82.2686 13.5489 81.8029 13.3289 81.1629 13.3289C80.7343 13.3289 80.38 13.4289 80.1 13.6289C79.8257 13.8232 79.6229 14.1061 79.4914 14.4775C79.36 14.8432 79.2943 15.2832 79.2943 15.7975ZM86.7202 18.9518C86.3316 18.9518 85.9887 18.8689 85.6916 18.7032C85.3944 18.5375 85.1602 18.2803 84.9887 17.9318C84.823 17.5832 84.7402 17.1375 84.7402 16.5946C84.7402 16.0289 84.8287 15.5689 85.0059 15.2146C85.183 14.8603 85.423 14.6003 85.7259 14.4346C86.0344 14.2689 86.383 14.1861 86.7716 14.1861C86.9944 14.1861 87.2087 14.2118 87.4144 14.2632C87.6259 14.3089 87.7973 14.3661 87.9287 14.4346L87.6973 15.0603C87.5659 15.0089 87.4116 14.9603 87.2344 14.9146C87.063 14.8689 86.903 14.8461 86.7544 14.8461C86.4744 14.8461 86.243 14.9118 86.0602 15.0432C85.8773 15.1746 85.7402 15.3689 85.6487 15.6261C85.5573 15.8832 85.5116 16.2032 85.5116 16.5861C85.5116 16.9518 85.5573 17.2632 85.6487 17.5203C85.7402 17.7775 85.8744 17.9718 86.0516 18.1032C86.2344 18.2346 86.4573 18.3003 86.7202 18.3003C86.9544 18.3003 87.163 18.2746 87.3459 18.2232C87.5287 18.1718 87.6973 18.1089 87.8516 18.0346V18.7032C87.703 18.7832 87.5402 18.8432 87.363 18.8832C87.1859 18.9289 86.9716 18.9518 86.7202 18.9518ZM90.5525 14.1861C90.9239 14.1861 91.2439 14.2718 91.5125 14.4432C91.781 14.6146 91.9867 14.8575 92.1296 15.1718C92.2782 15.4803 92.3525 15.8432 92.3525 16.2603V16.7146H89.4039C89.4153 17.2346 89.5382 17.6318 89.7725 17.9061C90.0067 18.1746 90.3353 18.3089 90.7582 18.3089C91.0325 18.3089 91.2753 18.2832 91.4867 18.2318C91.7039 18.1746 91.9267 18.0946 92.1553 17.9918V18.6518C91.9325 18.7546 91.7125 18.8289 91.4953 18.8746C91.2839 18.9261 91.0267 18.9518 90.7239 18.9518C90.3125 18.9518 89.9496 18.8632 89.6353 18.6861C89.321 18.5089 89.0753 18.2461 88.8982 17.8975C88.721 17.5432 88.6325 17.1118 88.6325 16.6032C88.6325 16.1003 88.7125 15.6689 88.8725 15.3089C89.0325 14.9489 89.2553 14.6718 89.541 14.4775C89.8325 14.2832 90.1696 14.1861 90.5525 14.1861ZM90.5525 14.8032C90.221 14.8032 89.9582 14.9203 89.7639 15.1546C89.5696 15.3832 89.4553 15.7032 89.421 16.1146H91.581C91.581 15.8518 91.5439 15.6232 91.4696 15.4289C91.3953 15.2346 91.281 15.0832 91.1267 14.9746C90.9782 14.8603 90.7867 14.8032 90.5525 14.8032ZM95.0887 14.1946C95.6144 14.1946 96.0058 14.3175 96.263 14.5632C96.5258 14.8089 96.6573 15.2003 96.6573 15.7375V18.8661H96.1173L95.9715 18.2146H95.9373C95.8115 18.3803 95.683 18.5203 95.5515 18.6346C95.4258 18.7432 95.2773 18.8232 95.1058 18.8746C94.9401 18.9261 94.7344 18.9518 94.4887 18.9518C94.2315 18.9518 94.0001 18.9032 93.7944 18.8061C93.5887 18.7089 93.4258 18.5603 93.3058 18.3603C93.1858 18.1546 93.1258 17.8975 93.1258 17.5889C93.1258 17.1318 93.2944 16.7803 93.6315 16.5346C93.9687 16.2832 94.4887 16.1461 95.1915 16.1232L95.9201 16.0975V15.8232C95.9201 15.4403 95.843 15.1746 95.6887 15.0261C95.5401 14.8775 95.3258 14.8032 95.0458 14.8032C94.823 14.8032 94.6087 14.8403 94.403 14.9146C94.203 14.9832 94.0115 15.0632 93.8287 15.1546L93.5973 14.5889C93.7915 14.4803 94.0173 14.3889 94.2744 14.3146C94.5315 14.2346 94.803 14.1946 95.0887 14.1946ZM95.2944 16.6461C94.7687 16.6689 94.403 16.7603 94.1973 16.9203C93.9973 17.0803 93.8973 17.3061 93.8973 17.5975C93.8973 17.8546 93.9687 18.0432 94.1115 18.1632C94.2544 18.2832 94.4401 18.3432 94.6687 18.3432C95.023 18.3432 95.3201 18.2375 95.5601 18.0261C95.8001 17.8089 95.9201 17.4775 95.9201 17.0318V16.6203L95.2944 16.6461ZM100.097 14.1861C100.611 14.1861 100.999 14.3203 101.262 14.5889C101.531 14.8518 101.665 15.2803 101.665 15.8746V18.8661H100.919V15.9261C100.919 15.5546 100.842 15.2775 100.688 15.0946C100.534 14.9118 100.297 14.8203 99.9765 14.8203C99.508 14.8203 99.1823 14.9632 98.9994 15.2489C98.8223 15.5346 98.7337 15.9461 98.7337 16.4832V18.8661H97.988V14.2718H98.588L98.6994 14.8975H98.7423C98.8337 14.7375 98.9508 14.6061 99.0937 14.5032C99.2365 14.3946 99.3937 14.3146 99.5651 14.2632C99.7365 14.2118 99.9137 14.1861 100.097 14.1861ZM106.843 18.8661H104.726V18.4203L105.403 18.2575V13.3632L104.726 13.1918V12.7461H106.843V13.1918L106.166 13.3632V18.2575L106.843 18.4203V18.8661ZM109.957 14.1861C110.471 14.1861 110.86 14.3203 111.123 14.5889C111.391 14.8518 111.526 15.2803 111.526 15.8746V18.8661H110.78V15.9261C110.78 15.5546 110.703 15.2775 110.548 15.0946C110.394 14.9118 110.157 14.8203 109.837 14.8203C109.368 14.8203 109.043 14.9632 108.86 15.2489C108.683 15.5346 108.594 15.9461 108.594 16.4832V18.8661H107.848V14.2718H108.448L108.56 14.8975H108.603C108.694 14.7375 108.811 14.6061 108.954 14.5032C109.097 14.3946 109.254 14.3146 109.426 14.2632C109.597 14.2118 109.774 14.1861 109.957 14.1861ZM114.877 14.8546H113.797V18.8661H113.043V14.8546H112.297V14.5032L113.043 14.2461V13.9803C113.043 13.5861 113.097 13.2661 113.205 13.0203C113.32 12.7746 113.483 12.5946 113.694 12.4803C113.905 12.3661 114.16 12.3089 114.457 12.3089C114.634 12.3089 114.794 12.3261 114.937 12.3603C115.085 12.3889 115.214 12.4232 115.323 12.4632L115.125 13.0546C115.034 13.0261 114.931 12.9975 114.817 12.9689C114.708 12.9403 114.594 12.9261 114.474 12.9261C114.245 12.9261 114.074 13.0118 113.96 13.1832C113.851 13.3489 113.797 13.6118 113.797 13.9718V14.2718H114.877V14.8546ZM119.43 16.5603C119.43 16.9432 119.381 17.2832 119.284 17.5803C119.193 17.8718 119.058 18.1203 118.881 18.3261C118.704 18.5318 118.49 18.6889 118.238 18.7975C117.987 18.9003 117.707 18.9518 117.398 18.9518C117.113 18.9518 116.847 18.9003 116.601 18.7975C116.361 18.6889 116.15 18.5318 115.967 18.3261C115.79 18.1203 115.653 17.8718 115.556 17.5803C115.458 17.2832 115.41 16.9432 115.41 16.5603C115.41 16.0518 115.49 15.6232 115.65 15.2746C115.816 14.9203 116.05 14.6518 116.353 14.4689C116.656 14.2803 117.013 14.1861 117.424 14.1861C117.818 14.1861 118.164 14.2803 118.461 14.4689C118.764 14.6518 119.001 14.9203 119.173 15.2746C119.344 15.6232 119.43 16.0518 119.43 16.5603ZM116.181 16.5603C116.181 16.9203 116.224 17.2346 116.31 17.5032C116.396 17.7661 116.53 17.9689 116.713 18.1118C116.896 18.2546 117.13 18.3261 117.416 18.3261C117.701 18.3261 117.936 18.2546 118.118 18.1118C118.301 17.9689 118.436 17.7661 118.521 17.5032C118.613 17.2346 118.658 16.9203 118.658 16.5603C118.658 16.1946 118.613 15.8832 118.521 15.6261C118.436 15.3689 118.301 15.1718 118.118 15.0346C117.936 14.8918 117.698 14.8203 117.407 14.8203C116.978 14.8203 116.667 14.9746 116.473 15.2832C116.278 15.5918 116.181 16.0175 116.181 16.5603ZM125.064 18.8661H124.301V16.0118H121.404V18.8661H120.641V12.7461H121.404V15.3346H124.301V12.7461H125.064V18.8661ZM130.174 14.2718V18.8661H129.574L129.463 18.2575H129.429C129.337 18.4175 129.217 18.5489 129.069 18.6518C128.926 18.7546 128.769 18.8289 128.597 18.8746C128.426 18.9261 128.246 18.9518 128.057 18.9518C127.714 18.9518 127.426 18.8946 127.191 18.7803C126.957 18.6603 126.78 18.4775 126.66 18.2318C126.546 17.9861 126.489 17.6689 126.489 17.2803V14.2718H127.243V17.2289C127.243 17.5946 127.32 17.8689 127.474 18.0518C127.629 18.2346 127.866 18.3261 128.186 18.3261C128.5 18.3261 128.746 18.2632 128.923 18.1375C129.106 18.0061 129.234 17.8175 129.309 17.5718C129.389 17.3203 129.429 17.0175 129.429 16.6632V14.2718H130.174ZM132.274 13.9375C132.274 14.1318 132.269 14.3146 132.257 14.4861C132.252 14.6518 132.243 14.7832 132.232 14.8803H132.274C132.394 14.6861 132.563 14.5232 132.78 14.3918C132.997 14.2603 133.272 14.1946 133.603 14.1946C134.14 14.1946 134.569 14.3946 134.889 14.7946C135.214 15.1889 135.377 15.7803 135.377 16.5689C135.377 17.0946 135.303 17.5346 135.154 17.8889C135.006 18.2432 134.797 18.5089 134.529 18.6861C134.266 18.8632 133.957 18.9518 133.603 18.9518C133.266 18.9518 132.989 18.8861 132.772 18.7546C132.56 18.6232 132.394 18.4661 132.274 18.2832H132.214L132.069 18.8661H131.529V12.3518H132.274V13.9375ZM133.466 14.8203C133.169 14.8203 132.932 14.8832 132.754 15.0089C132.583 15.1289 132.46 15.3175 132.386 15.5746C132.312 15.8261 132.274 16.1489 132.274 16.5432V16.5775C132.274 17.1432 132.357 17.5775 132.523 17.8803C132.694 18.1775 133.014 18.3261 133.483 18.3261C133.854 18.3261 134.134 18.1746 134.323 17.8718C134.512 17.5689 134.606 17.1318 134.606 16.5603C134.606 15.9832 134.512 15.5489 134.323 15.2575C134.134 14.9661 133.849 14.8203 133.466 14.8203Z"
        fill="#40AAD3"
      />
      <Defs>
        <ClipPath id="clip0_51_1474">
          <Rect
            width="70.7143"
            height="30.4464"
            fill="white"
            transform="translate(0.142822 0.142853)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );

  Font.register({
    family: "Montserrat",
    src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf",
  });
  Font.register({
    family: "Montserrat-Bold",
    src: "http://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf",
  });

  const createPDF = (data, namePdf) => {
    const drawText = (info, key) => {
      if (Array.isArray(info)) {
        return (
          <Text>
            <Text style={styles.boldCategory}>
              {key
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            : {info.join(", ")}
          </Text>
        );
      } else {
        return (
          <Text>
            <Text style={styles.boldCategory}>
              {key
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            : {info}
          </Text>
        );
      }
    };

    return (
      <Document title={namePdf}>
        <Page size="A4" style={styles.page}>
          <View fixed>
            <SvgOceanLogo />
            <Text>{"\n"}</Text>
          </View>
          <Text style={styles.title}>{namePdf} Data:</Text>

          <View style={styles.section}>
            {data.map((d, index) => {
              const keys = Object.keys(d);
              return (
                <div key={index}>
                  {keys.map((k, index2) => (
                    <div key={index2}>
                      {d[k] && k === "name" && (
                        <Text style={styles.boldTitle}>{d.name}</Text>
                      )}
                      {d[k] && k !== "name" && drawText(d[k], k)}
                      <Text>{"\n"}</Text>
                    </div>
                  ))}
                </div>
              );
            })}
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <>
      <LoadingButton
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        loading={isLoading}
        sx={{
          backgroundColor: palette + "bgExportButton",
          color: palette + "iconsColor",
          fontWeight: 700,
          borderRadius: 1,
          height: "34px",
          border: 0,

          "&:hover": {
            border: 0,
          },
          ".MuiSelect-icon": {
            color: palette + "iconsColor",
          },
        }}
        onClick={handleClick}
      >
        Export
      </LoadingButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "200px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", fontWeight: 600 }}
          >
            N.items to download:
          </Typography>
          <ToggleButtonGroup
            value={numberOfItems}
            onChange={(event, newNumber) => {
              setNumberOfItems(newNumber);
            }}
            size="small"
            exclusive
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="10">10</ToggleButton>
            <ToggleButton value="20">20</ToggleButton>
            <ToggleButton value="30">30</ToggleButton>
          </ToggleButtonGroup>
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", fontWeight: 600 }}
          >
            Format:
          </Typography>
          <ToggleButtonGroup
            value={typeOfExport}
            onChange={(event, newType) => {
              setTypeOfExport(newType);
            }}
            size="small"
            exclusive
          >
            <ToggleButton value="csv">CSV</ToggleButton>
            <ToggleButton value="jsonLD">JSONLD</ToggleButton>
            <ToggleButton value="pdf">PDF</ToggleButton>
          </ToggleButtonGroup>
          <Divider />
          <Box
            display={"flex"}
            sx={{ gap: 1, justifyContent: "space-between" }}
          >
            <Button
              sx={{ color: "#40AAD3" }}
              size="small"
              onClick={() => onClickExport(numberOfItems, typeOfExport)}
            >
              Export
            </Button>
            <Button
              size="small"
              sx={{ color: "#7B8FB7" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
function extractInfo(json, data, typeSearch) {
  const result = {
    name: data.name,
    id: data.id,
  };

  if (typeSearch !== "Person") {
    result.description = data.description;
  }

  for (const item of json) {
    if (typeof item === "object") {
      const { key, type, label } = item;
      const propertyKey = key.includes("_") ? label || key.split("_")[1] : key;

      result[propertyKey] = data[key];
    } else if (typeof item === "string") {
      const propertyKey = item.includes("_") ? item.split("_")[1] : item;
      result[propertyKey] = data[item];
    }
  }

  return result;
}
export { Export, extractInfo };
