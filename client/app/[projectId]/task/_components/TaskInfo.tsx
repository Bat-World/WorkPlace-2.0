import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PencilRuler } from "lucide-react";
import React from "react";
import Comment from "./Comment";

const TaskInfo = () => {
  return (
    <div className="w-10/12 flex gap-4">
      <Avatar className="w-11 h-11">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full h-auto rounded-3xl bg-[#141318] border border-[#3D3C41] flex flex-col p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="text-[var(--background)]/50 text-sm font-light">
                LETRYKA
              </p>
              <p className="text-[var(--background)]/50 text-sm font-light">
                2 өдрийн өмнө
              </p>
            </div>
            <Button className="bg-[#2E2C33]">
              <PencilRuler strokeWidth={1.5} />
              Засварлах
            </Button>
          </div>
          <p className="text-[var(--background)] text-2xl font-semibold">
            Main script & storyboard
          </p>
          <p className="text-[var(--background)] text-sm mt-3">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full mt-8 overflow-hidden"
          >
            <CarouselContent className="w-full pl-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-[30%] p-2"
                >
                  <div className="w-full aspect-square">
                    <Card className="w-full h-full">
                      <CardContent className="flex w-full h-full"></CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <Comment />
      </div>
    </div>
  );
};

export default TaskInfo;
