import { useFormik } from "formik";
import { useMemo, useState } from "react";
import Select from "react-select";
import { Card } from "src/components/Card/Card";
import { getTags } from "src/lib/util";
import styles from "./submit.module.scss";
import * as Yup from "yup";

export default function Submit() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pullRequestUrl, setPullRequestUrl] = useState<string | null>(null);

  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: {
      title: "",
      blurb: "",
      url: "",
      tags: [] as SelectOption[],
      username: "",
    },
    onSubmit: async (values) => {
      setSubmitError(null);

      const res = await fetch(`/api/submit-resource`, {
        method: "POST",
        body: JSON.stringify({
          ...values,
          tags: values.tags.map((t) => t.value),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status >= 400) {
        //t
        console.error(res);
        setSubmitError(data.error ?? `[${res.status}] ${res.statusText}`);
      } else {
        setPullRequestUrl(data.url);
      }
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      title: Yup.string(),
      blurb: Yup.string().max(150, "Please keep under 150 characters"),
      tags: Yup.array()
        .min(1, "Please select at least one tag")
        .max(3, "Please select no more than 3 tags"),
      url: Yup.string().matches(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please enter a valid URL"
      ),
      username: Yup.string(),
    }),
  });

  return (
    <div>
      <Card className={styles.card}>
        {!pullRequestUrl && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              <Label label="Title" error={errors.title}>
                <input
                  type="text"
                  name="title"
                  required
                  value={values.title}
                  onChange={handleChange}
                />
              </Label>
              <Label label="Link" error={errors.url}>
                <input
                  type="text"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                />
              </Label>
              <Label
                label="Blurb"
                description="A short description about this resource"
                error={errors.blurb}
              >
                <textarea
                  name="blurb"
                  value={values.blurb}
                  onChange={handleChange}
                />
              </Label>
              <Label
                label="Tags"
                description="Choose 1 to 3 tags that best fit this resource"
                error={errors.tags as string}
              >
                <TagsSelect
                  disabled={isSubmitting}
                  value={values.tags}
                  onChange={(tags) => setFieldValue("tags", tags)}
                />
              </Label>
              <Label
                label="GitHub Username (optional)"
                description="Adds your username to the generated pull request"
                error={errors.username}
              >
                <input
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
              </Label>
            </fieldset>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              Submit
            </button>
            {submitError && <div className={styles.error}>{submitError}</div>}
          </form>
        )}

        {pullRequestUrl && (
          <div className={styles.success}>
            <h2>Success!</h2>
            <p>
              You can view the pull request <a href={pullRequestUrl}>here</a>.
              It will be added once it is approved by a maintainer.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function Label({
  label,
  description,
  children,
  error,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className={styles.label} data-error={!!error}>
      <span className={styles.labelTitle}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
      {children}
      <span className={styles.error}>{error}</span>
    </label>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

function TagsSelect({
  value,
  onChange,
  disabled,
}: {
  value: SelectOption[];
  disabled?: boolean;
  onChange: (value: SelectOption[]) => void;
}) {
  const options = useMemo<SelectOption[]>(
    () =>
      getTags()
        .filter((tag) => tag !== "Team Pick")
        .map((tag) => ({
          label: tag,
          value: tag,
        })),
    []
  );

  return (
    <Select
      instanceId="tags"
      isMulti
      value={value}
      isDisabled={disabled}
      // limit to 3
      options={value.length > 3 ? value : options}
      menuPortalTarget={process.browser ? document.body : null}
      onChange={(v) => onChange(v as SelectOption[])}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}
