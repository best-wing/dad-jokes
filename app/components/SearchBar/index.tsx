"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { JokeTypes } from "@/app/types";
import axios from "axios";
import _ from "lodash";
import Image from "next/image";
import styles from "./styles.module.css";
import CurvedArrowImage from "@/public/curved_arrow.svg";

type IndicatorStatus = "collapsed" | "opened" | "loading";

interface SearchBarProps {
  onSelect: (joke: string) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [jokes, setJokes] = useState<JokeTypes[]>([]);
  const [indicatorStatus, setIndicatorStatus] =
    useState<IndicatorStatus>("collapsed");
  const [searchIndex, setSearchIndex] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // API request to fetch the jokes by search terms from 3rd pary api.
  const fetchJokes = async (query: string) => {
    try {
      const url = `https://icanhazdadjoke.com/search?term=${query}`;
      const res = await axios.get(url, {
        headers: { Accept: "application/json" },
      });
      setJokes(res.data.results);
    } catch (error) {
      console.error("Error fetching Jokes: ", error);
      setIndicatorStatus("collapsed");
    }
  };

  // Debounced function to delay the API request while user types
  const debouncedSearch = useCallback(
    _.debounce((query: string) => {
      fetchJokes(query);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchIndex(query);
    if (!query) {
      setIndicatorStatus("collapsed");
      return;
    }
    setIndicatorStatus("loading");
    debouncedSearch(query);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      inputRef.current &&
      dropdownRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIndicatorStatus("collapsed");
    }
  }, []);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIndicatorStatus("collapsed");
    }
  }, []);

  // Control the dropdown status by jokes state
  useEffect(() => {
    if (jokes.length > 0) {
      setIndicatorStatus("opened");
    } else if (searchIndex.length > 0) {
      alert("No results!");
      setIndicatorStatus("collapsed");
    }
  }, [jokes]);

  // Attach EventListener to fetch the outside clicked or Esc keydown event
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <>
      <div className={styles.searchBar}>
        <input
          ref={inputRef}
          data-testid="searchInput-test"
          type="text"
          className={styles.searchBarInput}
          value={searchIndex}
          onChange={handleInputChange}
          placeholder="Search..."
          onFocus={() => {
            if (jokes.length > 0) {
              setIndicatorStatus("opened");
            }
          }}
        />
        <span
          className={`${styles.indicator} ${
            indicatorStatus === "collapsed" && styles.downArrow
          } ${indicatorStatus === "opened" && styles.upArrow} ${
            indicatorStatus === "loading" && styles.hidden
          }`}
        ></span>
        <Image
          src={CurvedArrowImage}
          alt="Curved Arrow"
          width={20}
          className={
            indicatorStatus === "loading" ? styles.curvedArrow : styles.hidden
          }
        />
      </div>
      <div
        ref={dropdownRef}
        data-testid="dropdownList-test"
        className={
          indicatorStatus === "opened" ? styles.jokeList : styles.hidden
        }
      >
        {jokes.map((item, index) => (
          <div
            key={`jokeListItem_${index}`}
            onClick={() => {
              onSelect(item.joke);
              setIndicatorStatus("collapsed");
            }}
            className={styles.jokeListItem}
          >
            <p className={styles.jokeListItemText}>{item.joke}</p>
          </div>
        ))}
      </div>
    </>
  );
}
