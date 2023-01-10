import { Env } from "@/libraries/data";

declare global {
    function getMiniflareBindings(): Env;
}

export {};