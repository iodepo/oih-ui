import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export default function useSearchParam(param, def = undefined) {
    const [params, setParams] = useSearchParams()
    const setParam = useCallback(value => setParams({ ...Object.fromEntries(params), [param]: value }), [param, params, setParams])
    return [params.has(param) ? params.get(param) : def, setParam]
};
