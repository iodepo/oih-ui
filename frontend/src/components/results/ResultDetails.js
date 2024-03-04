import React, { Fragment, useState } from "react";
import { sortedUniq, capitalize, upperCase, words } from "lodash";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LinkMui from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { CATEGORIES } from "../../portability/configuration";

const palette = "custom.resultPage.resultsDetails.";
export const cutWithDots = (sentence, maxLength) => {
  if (sentence.length > maxLength) {
    var cutSentence = sentence.slice(0, maxLength) + "...";
    return cutSentence;
  } else {
    return sentence;
  }
};

const Keyword = ({ keyword }) => {
  const [truncated, setTruncated] = useState(true);
  return (
    <Chip
      label={keyword}
      sx={{
        maxWidth: truncated ? "12em" : undefined,
        marginRight: 1,
        fontSize: "12px",
        border: "1px solid",
        borderColor: palette + "chipBorder",
        borderRadius: "4px",
        background: "transparent",
        height: "20px",
      }}
      onClick={() => setTruncated(!truncated)}
    />
  ); /* <span
                className={`bg-secondary mx-1 truncate badge`}
                style={{ maxWidth: truncated ? '12em' : undefined }}
                onClick={() => setTruncated(!truncated)}
            >
                {keyword}
            </span> */
};

const Keywords = ({ result }) => {
  result = [...result];
  result.sort();
  result = sortedUniq(result);
  const [keywordsTruncated, setKeywordsTruncated] = useState(
    result.length > 20
  );
  return (
    <>
      <br />
      {result
        .map((keyword) => <Keyword key={keyword} keyword={keyword} />)
        .slice(0, keywordsTruncated ? 20 : undefined)}
      {keywordsTruncated && (
        <Button
          variant="outlined"
          sx={{
            verticalAlign: "super",
            color: palette + "keywordsColor",
            "&.MuiButton-outlined": {
              borderColor: palette + "keywordsBorderColor",
            },
          }}
          onClick={() => setKeywordsTruncated(false)}
        >
          Show More
        </Button>
      )}
      {/* <button
          className="btn-outline-secondary text-light mx-1 truncate btn badge"
          style={{ verticalAlign: "super" }}
          onClick={() => setKeywordsTruncated(false)}
        >
          Show More
        </button> */}
    </>
  );
};

const Id = ({ result }) => (
  <Typography sx={{ color: "black", fontSize: "12px" }}>{result}</Typography>
);

const Link = ({ result, Inner = Id }) => (
  <LinkMui
    href={result}
    rel="noopener noreferrer"
    target="_blank"
    sx={{ ".MuiTypography-root": { fontSize: "12px" } }}
    underline="hover"
  >
    <Inner result={result} />
  </LinkMui>
);

const DocumentAttributeList = ({ result, Inner = Id }) => (
  <>
    {result.map((item, i) => (
      <Fragment key={i}>
        <Inner result={i != result.length - 1 ? item + "," : item + ""} />
        {/* {i != result.length - 1 ? "" : ""}{" "} */}
      </Fragment>
    ))}
  </>
);

const Truncate = ({ result, Inner = Id }) => {
  const [truncated, setTruncated] = useState(true);
  return (
    <Typography
      component={"span"}
      onClick={() => setTruncated(!truncated)}
      sx={{ fontSize: "12px" }}
    >
      <Inner result={result} />
    </Typography>
    /*  <span
      onClick={() => setTruncated(!truncated)}
      className={truncated ? "truncate" : ""}
    >
      <Inner result={result} />
    </span> */
  );
};

const Providers = ({ result, Inner = Id, topic }) => {
  return (
    <Box sx={{ marginBottom: 1 }}>
      <Stack direction={"row"} spacing={2}>
        <Typography
          variant="body2"
          display={"flex"}
          alignItems={"center"}
          sx={{ fontSize: "10px", gap: 1 }}
        >
          <CircleIcon
            fontSize="small"
            sx={{ fontSize: "10px", color: palette + "topicColor" }}
          />
          {CATEGORIES.find((t) => t.id === topic).text}
        </Typography>
        {result.map((r) => (
          <Tooltip key={r} title={r} arrow>
            <Typography
              variant="body2"
              component="span"
              display={"flex"}
              alignItems={"center"}
              sx={{ fontSize: "10px", gap: 1 }}
            >
              <CircleIcon
                fontSize="small"
                sx={{ fontSize: "10px", color: palette + "providerColor" }}
              />
              <Box sx={{ fontSize: "10px", gap: 1 }}>{cutWithDots(r, 20)}</Box>
            </Typography>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
};

const typeMap = {
  string: Id,
  list: DocumentAttributeList,
  keywords: Keywords,
  link: Link,
  truncated: Truncate,
  circle: Providers,
};

// Takes a component ref: a string index into `typeMap`, a function of result => content or (result, inner) => content where inner is a Component, or a list of component refs
// Components take a result param for the content and an Inner param as a wrapper of the inner content
// Falsy params are given `Id`
const componentFor = (type) => {
  if (!type || type.length == 0) {
    return Id;
  } else if (Array.isArray(type)) {
    const [outer, ...inner] = type;
    const Outer = componentFor(outer);
    const Inner = componentFor(inner);
    return ({ result }) => <Outer Inner={Inner} result={result} />;
  } else if (typeof type == "string") {
    if (!(type in typeMap)) {
      console.error(`Unknown type ${type}, falling back to id`);
      return Id;
    }
    return typeMap[type];
  } else if (typeof type == "function") {
    return ({ result, Inner = Id }) => type(result, Inner);
  }
  console.error(`Unknown type ${type}, falling back to Id`, type);
  return Id;
};

const ResultElem = ({ result, name, children, type = undefined }) => {
  const Component = componentFor(type);

  return name in result ? (
    <Typography
      component={"span"}
      alignItems={"center"}
      columnGap={1}
      sx={{
        fontSize: "12px",
        display: "flex",
        marginBottom: 1,
        flexWrap: "wrap",
        gap: "6px",
      }}
    >
      {type !== "circle" && (
        <>
          <b>{children}:</b>{" "}
        </>
      )}
      <Component result={result[name]} topic={result["type"]} />
    </Typography>
  ) : null;
  {
    /* <p className="result-p">
      <b>{children}:</b> <Component result={result[name]} />
    </p> */
  }
};

const Result = (spec) => {
  spec = spec.map((elem) => {
    if (typeof elem == "string") {
      elem = { key: elem };
    }
    const id = elem.id ?? elem.key;
    const label =
      elem.label ??
      words(upperCase(id.replace(/^txt_/, "")))
        .map(capitalize)
        .join(" ");
    return (result) => (
      <ResultElem result={result} key={id} name={elem.key} type={elem.type}>
        {label}
      </ResultElem>
    );
  });
  return ({ result }) => <Stack>{spec.map((elem) => elem(result))}</Stack>;
};

export default Result;
