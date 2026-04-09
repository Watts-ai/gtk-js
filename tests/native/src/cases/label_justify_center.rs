use relm4::prelude::*;

pub struct LabelJustifyCenter;

#[relm4::component(pub)]
impl SimpleComponent for LabelJustifyCenter {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Centered",
            set_justify: gtk::Justification::Center,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
