import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  ButtonGroup,
  Dropdown,
  Checkbox,
  Grid,
  Icon,
  Label,
  Container,
  Header,
  Statistic,
  Menu,
  Divider,
  Segment,
  Popup,
  Button,
  Form,
  Message
} from "semantic-ui-react";
import { mount, route } from "navi";
import { useNavigation, Link } from "react-navi";
import { observer } from "mobx-react";
import lodashDebounce from "lodash.debounce";

import style from "./ProblemPage.module.less";

import { ProblemApi } from "@/api";
import { Locale } from "@/interfaces/Locale";
import localeMeta from "@/locales/meta";
import { appState } from "@/appState";
import { useIntlMessage } from "@/utils/hooks";
import toast from "@/utils/toast";
import copyToClipboard from "@/utils/copy-to-clipboard";
import { isValidDisplayId } from "@/utils/validators";

type ProblemDetail = ApiTypes.GetProblemDetailResponseDto;

async function fetchData(idType: "id" | "displayId", id: number, locale: string): Promise<ProblemDetail> {
  const { requestError, response } = await ProblemApi.getProblemDetail({
    locale: locale,
    [idType]: id
  });

  if (requestError || response.error) {
    toast.error(requestError || response.error);
    return null;
  }

  return response;
}

interface ProblemPageProps {
  idType: "id" | "displayId";
  requestedLocale: Locale;
  problem: ProblemDetail;
}

let ProblemPage: React.FC<ProblemPageProps> = props => {
  const _ = useIntlMessage();
  const navigation = useNavigation();

  useEffect(() => {
    appState.title = `${props.problem.title} - ${_("problem.title")}`;
  }, [appState.locale]);

  const idString = props.idType === "id" ? `P${props.problem.meta.id}` : `#${props.problem.meta.displayId}`;

  const timeLimit = "1000 ms";
  const memoryLimit = "256 MiB";

  const randomTagCount = Math.round(Math.random() * 4);
  const tags = useState(["NOIP", "模板", "图论", "素数", "线段树", "计算几何"].sort(() => Math.random() - 0.5).filter((_, i) => i <= randomTagCount))[0];

  // Begin toggle tags
  const [showTags, setShowTags] = useState(appState.showTagsInProblemSet);
  function toggleTags() {
    setShowTags(!showTags);
  }
  // End toggle tags

  // Begin copy sample
  const [lastCopiedSample, setLastCopiedSample] = useState<{ id: number; type: "input" | "output" }>({
    id: null,
    type: null
  });
  async function onCopySampleClick(id: number, type: "input" | "output", data: string) {
    if (await copyToClipboard(data)) {
      setLastCopiedSample({ id, type });
    } else {
      toast.error(_("problem.sample.failed_to_copy"));
    }
  }
  // End copy sample

  // Begin set display ID
  const [setDisplayIdInputValue, setSetDisplayIdInputValue] = useState((props.problem.meta.displayId || "").toString());
  const [setDisplayIdPending, setSetDisplayIdPending] = useState(false);
  async function onSetDisplayId() {
    if (setDisplayIdPending) return;
    setSetDisplayIdPending(true);

    if (!isValidDisplayId(setDisplayIdInputValue)) {
      toast.error(_("problem.action_error.set_display_id.INVALID_DISPLAY_ID"));
    } else {
      const { requestError, response } = await ProblemApi.setProblemDisplayId({
        problemId: props.problem.meta.id,
        displayId: parseInt(setDisplayIdInputValue)
      });

      if (requestError) toast.error(requestError);
      else if (response.error) {
        toast.error(
          _(`problem.action_error.set_display_id.${response.error}`, {
            displayId: setDisplayIdInputValue
          })
        );
      } else return navigation.refresh();
    }

    setSetDisplayIdPending(false);
  }
  // End set display ID

  // Begin set public
  const [setPublicPending, setSetPublicPending] = useState(false);
  async function onSetPublic(isPublic: boolean) {
    if (setPublicPending) return;
    setSetPublicPending(true);

    const { requestError, response } = await ProblemApi.setProblemPublic({
      problemId: props.problem.meta.id,
      isPublic
    });

    if (requestError) toast.error(requestError);
    else if (response.error) {
      toast.error(_(`problem.action_error.set_public.${response.error}`));
    } else return navigation.refresh();

    setSetPublicPending(false);
  }
  // End set public

  // Begin "localized content unavailable" message
  const [localizedContentUnavailableMessageVisable, setLocalizedContentUnavailableMessageVisable] = useState(true);
  // End "locaized content unavailable" message

  return (
    <>
      <Container className={style.container}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Container className={style.headerContainer}>
                <div>
                  <Header as="h1">
                    <strong>{idString}</strong>.&nbsp;
                    {props.problem.title}
                    {
                      props.problem.meta.locales.length > 1 &&
                      <Dropdown icon="globe" className={style.languageSelectIcon}>
                        <Dropdown.Menu>
                          {
                            props.problem.meta.locales.map((locale: Locale) =>
                              <Dropdown.Item
                                key={locale}
                                onClick={() => {
                                  navigation.navigate({
                                    query: {
                                      locale: locale
                                    }
                                  });
                                }}
                                flag={localeMeta[locale].flag}
                                text={localeMeta[locale].name}
                                value={locale}
                                selected={locale === props.problem.resultLocale}
                              />
                            )
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                  </Header>
                  {!props.problem.meta.isPublic && (
                    <Label color="red">
                      <Icon name="eye slash" />
                      {_(`problem.meta_labels.non_public`)}
                    </Label>
                  )}
                  {!props.problem.meta.displayId && (
                    <Label color="black">
                      <Icon name="hashtag" />
                      {_(`problem.meta_labels.no_display_id`)}
                    </Label>
                  )}
                  <Label color="teal">
                    <Icon name="book" />
                    {_(`problem.type.${props.problem.meta.type}`)}
                  </Label>
                  <Label color="pink">
                    <Icon name="clock" />
                    {timeLimit}
                  </Label>
                  <Label color="blue">
                    <Icon name="microchip" />
                    {memoryLimit}
                  </Label>
                  <Label color="grey" as="a" onClick={toggleTags} className={style.toggleTagsLabel}>
                    {!showTags ? _("problem.show_tags") : _("problem.hide_tags")}
                    <Icon
                      name={"caret down"}
                      style={{ transform: showTags && "rotateZ(-90deg)" }}
                    />
                  </Label>
                  {
                    showTags && <>
                      {tags.map(tag =>
                        <Label key={tag}>
                          {tag}
                        </Label>)}
                    </>
                  }
                </div>
              </Container>
              <Container>
                {(() => {
                  if (!localizedContentUnavailableMessageVisable) return;
                  let message: string;
                  if (props.requestedLocale && props.problem.resultLocale !== props.requestedLocale) {
                    message = _("common.localized_content_unavailable.requested_unavailable", {
                      display_locale: _(`language.${props.problem.resultLocale}`)
                    });
                  } else if (!props.requestedLocale && props.problem.resultLocale !== appState.locale) {
                    message = _("common.localized_content_unavailable.preferred_unavailable", {
                      display_locale: _(`language.${props.problem.resultLocale}`)
                    });
                  } else return;

                  return <Message
                    onDismiss={() => setLocalizedContentUnavailableMessageVisable(false)}
                    content={message}
                  />
                })()}
                {props.problem.contentSections.map((section, i) => (
                  <React.Fragment key={i}>
                    <Header size="large">{section.sectionTitle}</Header>
                    {section.type === "TEXT" ? (
                      <>
                        <p>{section.text}</p>
                      </>
                    ) : (
                      <>
                        <Grid columns="equal">
                          <Grid.Row>
                            <Grid.Column>
                              <Header size="small">
                                {_("problem.sample.input")}
                                <Label
                                  size="small"
                                  as="a"
                                  pointing="below"
                                  className={style.copySample}
                                  onClick={e =>
                                    onCopySampleClick(
                                      section.sampleId,
                                      "input",
                                      props.problem.samples[section.sampleId].inputData
                                    )
                                  }
                                >
                                  {lastCopiedSample.id === section.sampleId && lastCopiedSample.type === "input"
                                    ? _("problem.sample.copied")
                                    : _("problem.sample.copy")}
                                </Label>
                              </Header>
                              <Segment>
                                <pre className={style.sampleDataPre}>
                                  <code>{props.problem.samples[section.sampleId].inputData}</code>
                                </pre>
                              </Segment>
                            </Grid.Column>
                            <Grid.Column>
                              <Header size="small">
                                {_("problem.sample.output")}
                                <Label
                                  size="small"
                                  as="a"
                                  pointing="below"
                                  className={style.copySample}
                                  onClick={e =>
                                    onCopySampleClick(
                                      section.sampleId,
                                      "output",
                                      props.problem.samples[section.sampleId].outputData
                                    )
                                  }
                                >
                                  {lastCopiedSample.id === section.sampleId && lastCopiedSample.type === "output"
                                    ? _("problem.sample.copied")
                                    : _("problem.sample.copy")}
                                </Label>
                              </Header>
                              <Segment>
                                <pre className={style.sampleDataPre}>
                                  <code>{props.problem.samples[section.sampleId].outputData}</code>
                                </pre>
                              </Segment>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row className={style.sampleExplanation}>
                            <Grid.Column>
                              <p>{section.text}</p>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </Container>
            </Grid.Column>
            <Grid.Column width={4} className={style.rightColumn}>
              <div className={style.rightContainer}>
                <Statistic.Group size="small" className={style.headerRightStatisticGroup}>
                  <Statistic>
                    <Statistic.Value>114</Statistic.Value>
                    <Statistic.Label>{_("problem.statistic.submissions")}</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>514</Statistic.Value>
                    <Statistic.Label>{_("problem.statistic.accepted")}</Statistic.Label>
                  </Statistic>
                </Statistic.Group>
                <Divider className={style.divider} />
                <div className={style.actionMenusWrapper}>
                  <div className={style.actionMenus}>
                    <Menu pointing secondary vertical className={style.actionMenu}>
                      <Menu.Item
                        className={style.menuItemImportant}
                        name={_("problem.action.submit")}
                        icon="paper plane"
                        onClick={() => console.log("submit")}
                      />
                      <Menu.Item
                        name={_("problem.action.submission")}
                        icon="list"
                        onClick={() => console.log("submission")}
                      />
                      <Menu.Item
                        name={_("problem.action.statistics")}
                        icon="sort content ascending"
                        onClick={() => console.log("statistics")}
                      />
                      <Menu.Item
                        name={_("problem.action.testdata")}
                        icon="folder open"
                        onClick={() => console.log("testdata")}
                      />
                      <Menu.Item
                        name={_("problem.action.discussion")}
                        icon="comment alternate"
                        onClick={() => console.log("discussion")}
                      />
                    </Menu>
                    <Menu pointing secondary vertical className={`${style.actionMenu} ${style.secondActionMenu}`}>
                      {props.problem.permission["WRITE"] && (
                        <Menu.Item name={_("problem.action.edit")} icon="edit" onClick={() => console.log("edit")} />
                      )}
                      {props.problem.permission["WRITE"] && (
                        <Menu.Item
                          name={_("problem.action.manage_judge_info")}
                          icon="cog"
                          onClick={() => console.log("manage_judge_info")}
                        />
                      )}
                      {props.problem.permission["FULL_CONTROL"] && (
                        <Popup
                          trigger={
                            <Menu.Item
                              name={_("problem.action.set_display_id")}
                              icon="hashtag"
                              onClick={() => console.log("set_display_id")}
                            />
                          }
                          content={
                            <Form>
                              <Form.Input
                                style={{ width: 230 }}
                                placeholder={_("problem.action.set_display_id_new")}
                                value={setDisplayIdInputValue}
                                autoComplete="username"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setSetDisplayIdInputValue(e.target.value)
                                }
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    onSetDisplayId();
                                  }
                                }}
                              />
                              <Button loading={setDisplayIdPending} onClick={onSetDisplayId}>
                                {_("problem.action.set_display_id_submit")}
                              </Button>
                            </Form>
                          }
                          on="click"
                          position="top left"
                        />
                      )}
                      {props.problem.permission["FULL_CONTROL"] && (
                        <Popup
                          trigger={
                            <Menu.Item
                              name={
                                props.problem.meta.isPublic
                                  ? _("problem.action.set_non_public")
                                  : _("problem.action.set_public")
                              }
                              icon={props.problem.meta.isPublic ? "eye slash" : "eye"}
                              onClick={() => console.log("toggle_public")}
                            />
                          }
                          content={
                            <Button
                              loading={setPublicPending}
                              color={props.problem.meta.isPublic ? null : "green"}
                              content={
                                props.problem.meta.isPublic
                                  ? _("problem.action.set_non_public_confirm")
                                  : _("problem.action.set_public_confirm")
                              }
                              onClick={() => onSetPublic(!props.problem.meta.isPublic)}
                            />
                          }
                          on="click"
                          position="top left"
                        />
                      )}
                      {props.problem.permission["CONTROL"] && (
                        <Menu.Item
                          className={style.menuItemDangerous}
                          name={_("problem.action.delete")}
                          icon="delete"
                          onClick={() => console.log("delete")}
                        />
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
};

ProblemPage = observer(ProblemPage);

export default mount({
  "/by-id/:id": route({
    async getView(request) {
      const id = parseInt(request.params["id"]) || 1;
      const requestedLocale: Locale = request.query["locale"] in Locale && request.query["locale"] as Locale;
      const problem = await fetchData("id", id, requestedLocale || appState.locale);
      if (problem === null) {
        // TODO: Display an error page
        return null;
      }

      return <ProblemPage key={Math.random()} idType="id" requestedLocale={requestedLocale} problem={problem} />;
    }
  }),
  "/:displayId": route({
    async getView(request) {
      const displayId = parseInt(request.params["displayId"]) || 1;
      const requestedLocale: Locale = request.query["locale"] in Locale && request.query["locale"] as Locale;
      const problem = await fetchData("displayId", displayId, requestedLocale || appState.locale);
      if (problem === null) {
        // TODO: Display an error page
        return null;
      }

      return <ProblemPage key={Math.random()} idType="displayId" requestedLocale={requestedLocale} problem={problem} />;
    }
  })
});